import { useEffect, useRef, useState } from "react";
import type React from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { getAuthToken } from "@/lib/auth";
import type { MessageThread, Message } from "@/lib/types";
import { formatCurrency } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { deriveAESKeyFromPIN, decryptDocument, importPrivateKey, decryptAESKeyWithRSA, importPublicKey, encryptAESKeyWithRSA } from "@/lib/crypto";
import ChatComposer from "@/components/messages/ChatComposer";
import MessageList from "@/components/messages/MessageList";
import { Buffer } from "buffer";
import PaymentModal from "@/components/messages/PaymentModal";
import DocumentModals from "@/components/messages/DocumentModals";


export default function ChatAreaContent({
  activeThread,
  user,
  profile,
}: {
  activeThread: MessageThread | null;
  user: any;
  profile: any;
}) {
  
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [userDocuments, setUserDocuments] = useState<any[]>([]);
  const [pinInput, setPinInput] = useState("");
  const [submittingDocument, setSubmittingDocument] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [pinValidated, setPinValidated] = useState(false);
  const [validatingPin, setValidatingPin] = useState(false);
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [showViewDocumentModal, setShowViewDocumentModal] = useState(false);
  const [viewingSharedDocument, setViewingSharedDocument] = useState<any | null>(null);
  const [viewPin, setViewPin] = useState("");
  const [viewPinValidating, setViewPinValidating] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [attachedDocument, setAttachedDocument] = useState<any | null>(null);

  useEffect(() => {
    if (!activeThread) return;

    const fetch = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("thread_id", activeThread.id)
        .order("created_at", { ascending: true });
      setMessages((data as Message[]) ?? []);
    };
    fetch();

    const channel = supabase
      .channel(`thread-${activeThread.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `thread_id=eq.${activeThread.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadDocuments = async () => {
    if (!user) return;
    setLoadingDocuments(true);
    try {
      const { data } = await supabase
        .from("documents")
        .select("*, document_categories(name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setUserDocuments(data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
      addToast("Failed to load documents", "error");
    } finally {
      setLoadingDocuments(false);
    }
  };

  const validatePin = async () => {
    if (!pinInput) {
      addToast("Please enter your PIN", "warning");
      return;
    }

    setValidatingPin(true);
    try {
      const { data: userKeys, error: keyError } = await supabase
        .from("user_keys")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (keyError || !userKeys) {
        addToast("Could not find your security keys", "error");
        return;
      }

      const derivedAESKey = await deriveAESKeyFromPIN(pinInput, userKeys.salt);
      const encryptedPrivKeyBuffer = Buffer.from(userKeys.encrypted_private_key, "base64").buffer as ArrayBuffer;

      try {
        const decryptedPrivKeyBuffer = await decryptDocument(encryptedPrivKeyBuffer, derivedAESKey);
        const privKeyBase64 = new TextDecoder().decode(decryptedPrivKeyBuffer);
        const importedPrivKey = await importPrivateKey(privKeyBase64);
        setPrivateKey(importedPrivKey);
        setPinValidated(true);
        addToast("PIN verified successfully", "success");
      } catch (decryptErr) {
        addToast("Incorrect PIN", "error");
        setPinValidated(false);
      }
    } catch (err) {
      addToast(`PIN verification failed: ${(err as Error).message}`, "error");
      setPinValidated(false);
    } finally {
      setValidatingPin(false);
    }
  };

  const shareDocument = async () => {
    if (!selectedDocument || !activeThread || !user || !privateKey) return;
    if (!pinValidated) {
      addToast("Please verify your PIN first", "warning");
      return;
    }

    setSubmittingDocument(true);
    try {
      // 1. Decrypt own AES key via RSA
      const { data: accessData, error: accessDataError } = await supabase
        .from("document_access")
        .select("encrypted_aes_key")
        .eq("document_id", selectedDocument.id)
        .eq("user_id", user.id)
        .single();

      if (accessDataError || !accessData) {
        throw new Error("Could not access document encryption key.");
      }

      const rawAesKey = await decryptAESKeyWithRSA(accessData.encrypted_aes_key, privateKey);

      // 2. Figure out the recipient's user_id
      let recipientUserId: string;
      if (profile?.role === "provider") {
        recipientUserId = activeThread.client_id;
      } else {
        const { data: members } = await supabase
          .from("provider_members")
          .select("user_id")
          .eq("provider_id", activeThread.provider_id)
          .limit(1);
        if (!members || members.length === 0) throw new Error("Could not find provider member");
        recipientUserId = members[0].user_id;
      }

      // 3. Fetch recipient's public key
      const { data: recipKeys } = await supabase
        .from("user_keys")
        .select("public_key")
        .eq("user_id", recipientUserId)
        .single();
      if (!recipKeys) throw new Error("Recipient has no public key");

      // 4. Encrypt AES key with recipient's RSA public key
      const recipPubKey = await importPublicKey(recipKeys.public_key);
      const encryptedForRecipient = await encryptAESKeyWithRSA(rawAesKey, recipPubKey);

      // 5. Insert document_access row for the recipient
      await supabase.from("document_access").insert({
        document_id: selectedDocument.id,
        user_id: recipientUserId,
        encrypted_aes_key: encryptedForRecipient,
      });

      // 6. Insert message — only name and docId, no raw key
      const message = `📎 Document Shared: ${selectedDocument.name}||||${selectedDocument.id}`;
      await supabase.from("messages").insert({
        thread_id: activeThread.id,
        sender_id: user.id,
        sender_type: profile?.role === "provider" ? "provider" : "client",
        body: message,
      });

      addToast("Document shared successfully", "success");
      setShowDocumentModal(false);
      setSelectedDocument(null);
      setPinInput("");
      setPinValidated(false);
    } catch (err) {
      addToast(`Failed to share document: ${(err as Error).message}`, "error");
    } finally {
      setSubmittingDocument(false);
    }
  };

  const viewSharedDocument = async (docName: string, docId?: string) => {
    try {
      setViewingSharedDocument({ name: docName, loading: true });
      setShowViewDocumentModal(true);

      if (!docId) {
        addToast("Document not found", "error");
        setViewingSharedDocument({ name: docName, loading: false });
        return;
      }

      // 1. Look up document metadata (RLS: thread check OR document_access)
      const { data: doc, error: docError } = await supabase
        .from("documents")
        .select("*, document_categories(name)")
        .eq("id", docId)
        .maybeSingle();

      if (docError || !doc) {
        addToast("Document not found", "error");
        setViewingSharedDocument({ name: docName, loading: false });
        return;
      }

      // 2. Look up encrypted AES key from document_access (RLS: user_id = me)
      const { data: accessRow, error: accessError } = await supabase
        .from("document_access")
        .select("encrypted_aes_key")
        .eq("document_id", docId)
        .eq("user_id", user?.id)
        .maybeSingle();

      if (accessError || !accessRow) {
        addToast("You don't have access to decrypt this document", "error");
        setViewingSharedDocument({ name: docName, loading: false });
        return;
      }

      // 3. Need PIN to decrypt — prompt user
      setViewingSharedDocument({ 
        ...doc, 
        loading: false, 
        needsPin: true, 
        encryptedAesKey: accessRow.encrypted_aes_key 
      });
    } catch (err) {
      addToast(`Failed to load document: ${(err as Error).message}`, "error");
      setShowViewDocumentModal(false);
    }
  };

  const decryptSharedDocument = async () => {
    if (!viewingSharedDocument || !viewPin || !user) return;
    setViewPinValidating(true);
    try {
      // 1. Derive AES key from PIN + salt
      const { data: userKeys, error: keyError } = await supabase
        .from("user_keys")
        .select("salt, encrypted_private_key")
        .eq("user_id", user.id)
        .single();
      if (keyError || !userKeys) throw new Error("No keys found");

      const derivedKey = await deriveAESKeyFromPIN(viewPin, userKeys.salt);
      const encPrivBuf = Buffer.from(userKeys.encrypted_private_key, "base64").buffer as ArrayBuffer;
      const decryptedPrivBuf = await decryptDocument(encPrivBuf, derivedKey);
      const privKeyBase64 = new TextDecoder().decode(decryptedPrivBuf);
      const privKey = await importPrivateKey(privKeyBase64);

      // 2. Decrypt AES key with RSA private key
      const rawAesKey = await decryptAESKeyWithRSA(viewingSharedDocument.encryptedAesKey, privKey);

      // 3. Generate signed URL
      const { data: urlData, error: urlError } = await supabase
        .storage
        .from("documents")
        .createSignedUrl(viewingSharedDocument.file_path, 3600);
      if (urlError || !urlData?.signedUrl) throw new Error("Could not generate document link");

      // 4. Download and decrypt
      const fileResp = await fetch(urlData.signedUrl);
      if (!fileResp.ok) throw new Error("Failed to download file");
      const encryptedBuffer = await fileResp.arrayBuffer();
      const decryptedBuffer = await decryptDocument(encryptedBuffer, rawAesKey);
      const blob = new Blob([decryptedBuffer], { type: viewingSharedDocument.content_type || "application/octet-stream" });

      setViewingSharedDocument((prev: any) => ({ ...prev, fileUrl: URL.createObjectURL(blob), needsPin: false }));
      setViewPin("");
      addToast("Document decrypted successfully", "success");
    } catch (err) {
      addToast("Incorrect PIN or decryption failed", "error");
    } finally {
      setViewPinValidating(false);
    }
  };

  const handleStripePayment = async () => {
    if (!paymentAmount || !activeThread || !user) return;

    setSubmittingPayment(true);
    try {
      const amount = Math.round(parseFloat(paymentAmount) * 100);
      const providerId = activeThread.provider_id || activeThread.client_id;

      if (!providerId) {
        addToast("Provider ID not found", "error");
        return;
      }

      const ordersData = (activeThread as any).orders;
      const threadOrders = Array.isArray(ordersData) ? ordersData : [];
      const matchingOrder = threadOrders.find((o: any) => o.amount === amount);

      if (!matchingOrder) {
        addToast("Order not found", "error");
        return;
      }

      const authToken = await getAuthToken();
      if (!authToken) { addToast("Not authenticated", "error"); return; }
      const response = await fetch("/api/payment/checkout-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-token": authToken,
        },
        body: JSON.stringify({
          amount,
          providerId,
          orderId: matchingOrder.id,
          notes: undefined,
          currency:
            matchingOrder.currency ||
            (activeThread as any)?.service?.currency ||
            undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout session");
      }

      const data = await response.json();

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      addToast(`Payment failed: ${(err as Error).message}`, "error");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const sendMessage = async () => {
    if ((!draft.trim() && !attachedDocument) || !activeThread || !user || !profile) return;
    setSending(true);

    try {
      if (draft.trim()) {
        await supabase.from("messages").insert({
          thread_id: activeThread.id,
          sender_id: user.id,
          sender_type: profile.role === 'provider' ? 'provider' : 'client',
          body: draft.trim(),
        });
      }

      if (attachedDocument && privateKey) {
        await sendAttachedDocument();
      }

      setDraft("");
      setAttachedDocument(null);
    } catch (err) {
      addToast(`Failed to send message: ${(err as Error).message}`, "error");
    } finally {
      setSending(false);
    }
  };

  const sendAttachedDocument = async () => {
    if (!attachedDocument || !activeThread || !user || !privateKey) return;

    try {
      // 1. Decrypt own AES key via RSA
      const { data: accessData, error: accessDataError } = await supabase
        .from("document_access")
        .select("encrypted_aes_key")
        .eq("document_id", attachedDocument.id)
        .eq("user_id", user.id)
        .single();

      if (accessDataError || !accessData) {
        throw new Error("Could not access document encryption key.");
      }

      const rawAesKey = await decryptAESKeyWithRSA(accessData.encrypted_aes_key, privateKey);

      // 2. Figure out the recipient's user_id
      let recipientUserId: string;
      if (profile?.role === "provider") {
        recipientUserId = activeThread.client_id;
      } else {
        const { data: members } = await supabase
          .from("provider_members")
          .select("user_id")
          .eq("provider_id", activeThread.provider_id)
          .limit(1);
        if (!members || members.length === 0) throw new Error("Could not find provider member");
        recipientUserId = members[0].user_id;
      }

      // 3. Fetch recipient's public key and encrypt AES key for them
      const { data: recipKeys } = await supabase
        .from("user_keys")
        .select("public_key")
        .eq("user_id", recipientUserId)
        .single();
      if (!recipKeys) throw new Error("Recipient has no public key");

      const recipPubKey = await importPublicKey(recipKeys.public_key);
      const encryptedForRecipient = await encryptAESKeyWithRSA(rawAesKey, recipPubKey);

      // 4. Insert document_access for recipient
      await supabase.from("document_access").insert({
        document_id: attachedDocument.id,
        user_id: recipientUserId,
        encrypted_aes_key: encryptedForRecipient,
      });

      // 5. Insert message — name and docId only
      const message = `📎 Document Shared: ${attachedDocument.name}||||${attachedDocument.id}`;
      await supabase.from("messages").insert({
        thread_id: activeThread.id,
        sender_id: user.id,
        sender_type: profile?.role === "provider" ? "provider" : "client",
        body: message,
      });

      addToast("Document sent successfully", "success");
    } catch (err) {
      addToast(`Failed to send document: ${(err as Error).message}`, "error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!activeThread) return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground">{t("messages.select_conversation")}</div>
  );

  return (
    <div className="flex flex-1 flex-col">
      <MessageList
        messages={messages}
        activeThread={activeThread}
        user={user}
        profile={profile}
        t={t}
        formatCurrency={formatCurrency}
        viewSharedDocument={viewSharedDocument}
        setPaymentAmount={setPaymentAmount}
        setShowPaymentModal={setShowPaymentModal}
        setShowDocumentModal={setShowDocumentModal}
      />

      <div ref={bottomRef} />

      <ChatComposer
        attachedDocument={attachedDocument}
        setAttachedDocument={setAttachedDocument}
        setShowAttachmentModal={setShowAttachmentModal}
        draft={draft}
        setDraft={setDraft}
        handleKeyDown={handleKeyDown}
        sendMessage={sendMessage}
        sending={sending}
        t={t}
      />

      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        activeThread={activeThread}
        paymentAmount={paymentAmount}
        submittingPayment={submittingPayment}
        handleStripePayment={handleStripePayment}
      />

      <DocumentModals
        showDocumentModal={showDocumentModal}
        showAttachmentModal={showAttachmentModal}
        onCloseAll={() => { setShowDocumentModal(false); setShowAttachmentModal(false); setSelectedDocument(null); setPinInput(""); setPinValidated(false); }}
        selectedDocument={selectedDocument}
        setSelectedDocument={setSelectedDocument}
        userDocuments={userDocuments}
        loadDocuments={loadDocuments}
        loadingDocuments={loadingDocuments}
        pinInput={pinInput}
        setPinInput={setPinInput}
        pinValidated={pinValidated}
        setPinValidated={setPinValidated}
        validatingPin={validatingPin}
        submittingDocument={submittingDocument}
        validatePin={validatePin}
        shareDocument={shareDocument}
        setShowAttachmentModal={setShowAttachmentModal}
        showViewDocumentModal={showViewDocumentModal}
        viewingSharedDocument={viewingSharedDocument}
        setShowViewDocumentModal={setShowViewDocumentModal}
        setAttachedDocument={setAttachedDocument}
        viewPin={viewPin}
        setViewPin={setViewPin}
        viewPinValidating={viewPinValidating}
        onDecrypt={decryptSharedDocument}
      />
    </div>
  );
}
