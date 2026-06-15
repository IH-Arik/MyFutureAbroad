import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { createPaymentRequest, formatCurrency } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import ViewDocumentModal from "@/components/messages/ViewDocumentModal";
import SendDocModal from "@/components/provider/SendDocModal";
import ThreadList from "@/components/provider/messages/ThreadList";
import ThreadHeader from "@/components/provider/messages/ThreadHeader";
import Composer from "@/components/provider/messages/Composer";
import ProviderMessageList from "@/components/provider/messages/ProviderMessageList";
import ProviderDocumentRequestModal from "@/components/provider/ProviderDocumentRequestModal";
import { deriveAESKeyFromPIN, decryptDocument, importPrivateKey, decryptAESKeyWithRSA, importPublicKey, encryptAESKeyWithRSA } from "@/lib/crypto";
import { Buffer } from "buffer";
import type { MessageThread, Message } from "@/lib/types";

function getFirstOrderCurrency(thread: any): string | undefined {
  if (!thread) return undefined;
  const orders = Array.isArray((thread as any).orders) ? (thread as any).orders : [];
  return orders[0]?.currency || undefined;
}


export default function MessagesPanelContent({ providerId, userId }: { providerId: string; userId: string }) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentCurrency, setPaymentCurrency] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [submittingDocument, setSubmittingDocument] = useState(false);
  const [showViewDocumentModal, setShowViewDocumentModal] = useState(false);
  const [viewingSharedDocument, setViewingSharedDocument] = useState<any | null>(null);
  const [viewPin, setViewPin] = useState("");
  const [viewPinValidating, setViewPinValidating] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [showSendDocModal, setShowSendDocModal] = useState(false);
  const [providerDocs, setProviderDocs] = useState<any[]>([]);
  const [loadingProviderDocs, setLoadingProviderDocs] = useState(false);
  const [selectedSendDoc, setSelectedSendDoc] = useState<any | null>(null);
  const [sendDocPin, setSendDocPin] = useState("");
  const [sendDocPinValidated, setSendDocPinValidated] = useState(false);
  const [sendDocValidatingPin, setSendDocValidatingPin] = useState(false);
  const [sendDocPrivateKey, setSendDocPrivateKey] = useState<CryptoKey | null>(null);
  const [sendingDoc, setSendingDoc] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      addToast(t("orders.payment_success"), "success");
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => setRefetchTrigger((prev) => prev + 1), 1000);
    } else if (paymentStatus === "cancelled") {
      addToast(t("orders.payment_cancelled"), "info");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams, addToast, t]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: threadData, error: threadError } = await supabase
          .from("message_threads")
          .select(`
            *,
            client:profiles(id, full_name, avatar_url),
            orders(id, client_id, service_id, provider_id, status, amount, payment_status, notes, currency, created_at, updated_at, service:services(id, title, price_usd, currency, service_type)),
            service:services(id, title, price_usd, price_type, currency, service_type),
            provider:providers(id, company_name, preferred_currency)
          `)
          .eq("provider_id", providerId)
          .order("created_at", { ascending: false });

        console.log("[MessagesPanel] Raw threadData:", JSON.stringify(threadData, null, 2));
        console.log("[MessagesPanel] threadError:", threadError);

        const data = (threadData as any[]) ?? [];

        const loaded = data.map((thread: any) => {
          let provider = thread.provider;

          if (Array.isArray(thread.providers)) {
            provider = thread.providers[0];
          } else if (thread.providers && typeof thread.providers === "object") {
            provider = thread.providers;
          }

          // Normalize client — PostgREST may return it as an array or single object
          let client = thread.client;
          if (Array.isArray(thread.client)) {
            client = thread.client[0];
          }

          const result = {
            ...thread,
            provider,
            client: client || null,
          };

          console.log("[MessagesPanel] Normalized thread:", {
            id: result.id,
            client_id: result.client_id,
            client_full_name: result.client?.full_name,
            order_count: Array.isArray(result.orders) ? result.orders.length : 'not_array',
            first_order_service: Array.isArray(result.orders) ? result.orders[0]?.service?.title : undefined,
            thread_service: result.service?.title,
          });

          return result;
        });

        console.log("[MessagesPanel] Setting threads (", loaded.length, "):", loaded.map(t => ({ id: t.id, client: t.client?.full_name, service: Array.isArray(t.orders) ? t.orders[0]?.service?.title : t.service?.title })));
        setThreads((loaded as MessageThread[]) ?? []);

        const threadId = searchParams.get("thread");
        if (threadId) {
          const match = loaded.find((t: any) => t.id === threadId);
          if (match) {
            console.log("[MessagesPanel] Setting activeThread from URL param:", { id: match.id, client: match.client?.full_name });
            setActiveThread(match as MessageThread);
          }
        } else if (activeThread) {
          const updatedThread = loaded.find((t: any) => t.id === activeThread.id);
          if (updatedThread) {
            console.log("[MessagesPanel] Updating activeThread from refetch:", { id: updatedThread.id, client_full_name: updatedThread.client?.full_name });
            setActiveThread(updatedThread as MessageThread);
          }
        }
      } catch (err) {
        console.error("Failed to load message threads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [providerId, refetchTrigger]);

  const submitPaymentRequest = async () => {
    if (!paymentAmount.trim() || !activeThread || !userId) return;
    setSubmittingPayment(true);
    try {
      const amountFloat = parseFloat(paymentAmount);
      if (!Number.isFinite(amountFloat) || amountFloat <= 0) {
        addToast(t("provider.invalid_amount") || "Invalid amount", "error");
        return;
      }

      const amountCents = Math.round(amountFloat * 100);

      const firstOrder = (Array.isArray((activeThread as any)?.orders) ? (activeThread as any).orders[0] : null);
      const clientId = firstOrder?.client_id || (activeThread as any)?.client_id;
      const serviceId = firstOrder?.service_id || (activeThread as any)?.service?.id || (activeThread as any)?.service?.id;

      if (!clientId || !serviceId) {
        addToast(t("provider.missing_client_or_service") || "Could not determine client or service", "error");
        return;
      }

      const req = {
        clientId,
        serviceId,
        providerId: providerId,
        threadId: activeThread.id,
        amount: amountCents,
        notes: paymentNotes || undefined,
        currency: paymentCurrency || firstOrder?.currency || (activeThread as any)?.service?.currency || (activeThread as any)?.provider?.preferred_currency || "USD",
      };

      await createPaymentRequest(req);
      addToast(t("orders.request_created") || "Payment request created", "success");
      setShowPaymentModal(false);
      setPaymentAmount("");
      setPaymentNotes("");
      setPaymentCurrency("");
      setRefetchTrigger((p) => p + 1);
    } catch (err: any) {
      addToast(`Failed to create payment request: ${err?.message || String(err)}`, "error");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const submitDocumentRequest = async () => {
    if (!documentTitle.trim() || !activeThread || !userId) return;
    setSubmittingDocument(true);
    try {
      const body = `📄 Document Requested: "${documentTitle}"\n${documentDescription || ""}`;
      await supabase.from("messages").insert({
        thread_id: activeThread.id,
        sender_id: userId,
        sender_type: "provider",
        body,
      });

      addToast(t("provider.document_request_sent") || "Document request sent", "success");
      setShowDocumentModal(false);
      setDocumentTitle("");
      setDocumentDescription("");
      setRefetchTrigger((p) => p + 1);
    } catch (err: any) {
      addToast(`Failed to send document request: ${err?.message || String(err)}`, "error");
    } finally {
      setSubmittingDocument(false);
    }
  };

  const openSendDocModal = async () => {
    setShowSendDocModal(true);
    setSelectedSendDoc(null);
    setSendDocPin("");
    setSendDocPinValidated(false);
    setSendDocPrivateKey(null);
    if (!userId) return;
    setLoadingProviderDocs(true);
    try {
      const { data } = await supabase
        .from("documents")
        .select("*, document_categories(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setProviderDocs(data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
      addToast("Failed to load documents", "error");
    } finally {
      setLoadingProviderDocs(false);
    }
  };

  const validateSendDocPin = async () => {
    if (!sendDocPin) {
      addToast("Please enter your PIN", "warning");
      return;
    }
    setSendDocValidatingPin(true);
    try {
      const { data: userKeys, error: keyError } = await supabase
        .from("user_keys")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (keyError || !userKeys) {
        addToast("Could not find your security keys", "error");
        return;
      }
      const derivedAESKey = await deriveAESKeyFromPIN(sendDocPin, userKeys.salt);
      const encryptedPrivKeyBuffer = Buffer.from(userKeys.encrypted_private_key, "base64").buffer as ArrayBuffer;
      try {
        const decryptedPrivKeyBuffer = await decryptDocument(encryptedPrivKeyBuffer, derivedAESKey);
        const privKeyBase64 = new TextDecoder().decode(decryptedPrivKeyBuffer as ArrayBuffer);
        const importedPrivKey = await importPrivateKey(privKeyBase64);
        setSendDocPrivateKey(importedPrivKey);
        setSendDocPinValidated(true);
        addToast("PIN verified", "success");
      } catch (e) {
        addToast("Incorrect PIN", "error");
        setSendDocPinValidated(false);
      }
    } catch (err: any) {
      addToast(`PIN verification failed: ${err?.message || String(err)}`, "error");
    } finally {
      setSendDocValidatingPin(false);
    }
  };

  const sendDocumentToClient = async () => {
    if (!selectedSendDoc || !activeThread || !sendDocPrivateKey) return;
    if (!sendDocPinValidated) {
      addToast("Please verify your PIN first", "warning");
      return;
    }
    setSendingDoc(true);
    try {
      // 1. Decrypt own AES key via RSA
      const { data: accessData, error: accessErr } = await supabase
        .from("document_access")
        .select("encrypted_aes_key")
        .eq("document_id", selectedSendDoc.id)
        .eq("user_id", userId)
        .single();
      if (accessErr || !accessData) throw new Error("Could not access document encryption key.");

      const rawAesKey = await decryptAESKeyWithRSA(accessData.encrypted_aes_key, sendDocPrivateKey);

      // 2. Recipient is the client
      const recipientUserId = activeThread.client_id;

      // 3. Fetch recipient's public key and encrypt AES key for them
      const { data: recipKeys } = await supabase
        .from("user_keys")
        .select("public_key")
        .eq("user_id", recipientUserId)
        .single();
      if (!recipKeys) throw new Error("Client has no public key");

      const recipPubKey = await importPublicKey(recipKeys.public_key);
      const encryptedForRecipient = await encryptAESKeyWithRSA(rawAesKey, recipPubKey);

      // 4. Insert document_access for the recipient
      await supabase.from("document_access").insert({
        document_id: selectedSendDoc.id,
        user_id: recipientUserId,
        encrypted_aes_key: encryptedForRecipient,
      });

      // 5. Insert message — name and docId only
      const message = `📎 Document Shared: ${selectedSendDoc.name}||||${selectedSendDoc.id}`;
      await supabase.from("messages").insert({
        thread_id: activeThread.id,
        sender_id: userId,
        sender_type: "provider",
        body: message,
      });
      addToast("Document sent", "success");
      setShowSendDocModal(false);
      setSelectedSendDoc(null);
      setSendDocPin("");
      setSendDocPinValidated(false);
      setSendDocPrivateKey(null);
    } catch (err: any) {
      addToast(`Failed to send document: ${err?.message || String(err)}`, "error");
    } finally {
      setSendingDoc(false);
    }
  };

  useEffect(() => {
    if (!activeThread) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("thread_id", activeThread.id)
        .order("created_at", { ascending: true });
      setMessages((data as Message[]) ?? []);
    };
    fetchMessages();

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

  const sendMessage = async () => {
    if ((!draft.trim() && !selectedSendDoc) || !activeThread || !userId) return;
    setSending(true);
    try {
      if (draft.trim()) {
        await supabase.from("messages").insert({
          thread_id: activeThread.id,
          sender_id: userId,
          sender_type: "provider",
          body: draft.trim(),
        });
      }

      if (selectedSendDoc && sendDocPrivateKey) {
        await sendDocumentToClient();
      }

      setDraft("");
      setSelectedSendDoc(null);
    } catch (err: any) {
      addToast(`Failed to send message: ${err?.message || String(err)}`, "error");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
        .eq("user_id", userId)
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
        encryptedAesKey: accessRow.encrypted_aes_key,
      });
    } catch (err: any) {
      addToast(`Failed to load document: ${err?.message || String(err)}`, "error");
      setShowViewDocumentModal(false);
    }
  };

  const decryptSharedDocument = async () => {
    if (!viewingSharedDocument || !viewPin || !userId) return;
    setViewPinValidating(true);
    try {
      // 1. Derive AES key from PIN + salt
      const { data: userKeys, error: keyError } = await supabase
        .from("user_keys")
        .select("salt, encrypted_private_key")
        .eq("user_id", userId)
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

  return (
    <div className="flex h-[65vh]">
      <ThreadList loading={loading} threads={threads} activeThread={activeThread} setActiveThread={setActiveThread} t={t} />

      {activeThread ? (
        <div className="flex flex-1 flex-col">
          <ThreadHeader activeThread={activeThread} t={t} />

          <ProviderMessageList
            messages={messages}
            activeThread={activeThread as MessageThread}
            userId={userId}
            t={t}
            viewSharedDocument={viewSharedDocument}
            bottomRef={bottomRef}
          />

          <Composer
            draft={draft}
            setDraft={setDraft}
            handleKeyDown={handleKeyDown}
            sendMessage={sendMessage}
            sending={sending}
            setShowPaymentModal={setShowPaymentModal}
            setShowDocumentModal={setShowDocumentModal}
            openSendDocModal={openSendDocModal}
            activeThread={activeThread}
            setPaymentCurrency={setPaymentCurrency}
            t={t}
          />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">{t("messages.select_conversation")}</div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white dark:bg-[#1f1f1f] rounded-lg max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-border/50 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{t("provider.request_payment")}</h2>
              <button onClick={() => setShowPaymentModal(false)} className="text-muted-foreground hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{t("messages.amount")}</label>
                <p className="text-xs text-muted-foreground mb-2">Client pays this amount. After 10% commission, you receive the amount below.</p>
                <input type="number" step="0.01" min="0" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="0.00" className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground dark:bg-[#1f1f1f] dark:border-white/10" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Payment Currency</label>
                <p className="text-xs text-muted-foreground mb-2">Select the currency for this payment request.</p>
                <select value={paymentCurrency} onChange={(e) => setPaymentCurrency(e.target.value)} className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground dark:bg-[#1f1f1f] dark:border-white/10">
                  <option value="">{`Default (${((Array.isArray((activeThread as any)?.orders) ? (activeThread as any).orders[0]?.currency : null) || (activeThread as any)?.service?.currency || activeThread?.provider?.preferred_currency || "USD")})`}</option>
                  <option value="USD">USD - United States Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="CAD">CAD - Canadian Dollar ($)</option>
                  <option value="AUD">AUD - Australian Dollar ($)</option>
                  <option value="CHF">CHF - Swiss Franc</option>
                  <option value="SEK">SEK - Swedish Krona</option>
                  <option value="NOK">NOK - Norwegian Krone</option>
                  <option value="DKK">DKK - Danish Krone</option>
                  <option value="PLN">PLN - Polish Zloty</option>
                  <option value="CZK">CZK - Czech Koruna</option>
                  <option value="HUF">HUF - Hungarian Forint</option>
                  <option value="RON">RON - Romanian Leu</option>
                  <option value="TRY">TRY - Turkish Lira</option>
                  <option value="JPY">JPY - Japanese Yen (¥)</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                  <option value="SGD">SGD - Singapore Dollar</option>
                  <option value="HKD">HKD - Hong Kong Dollar</option>
                </select>
              </div>

              {paymentAmount && (
                <div className="mt-3 space-y-1 text-sm bg-muted/50 dark:bg-white/5 p-3 rounded">
                  <p className="text-muted-foreground">− {t("messages.commission")} (10%): <span className="text-foreground font-medium">{formatCurrency(Math.round(parseFloat(paymentAmount) * 10), paymentCurrency || getFirstOrderCurrency(activeThread) || (activeThread as any)?.service?.currency || activeThread?.provider?.preferred_currency || 'USD')}</span></p>
                  <p className="font-semibold text-foreground border-t border-border/50 pt-2">You receive: {formatCurrency(Math.round(parseFloat(paymentAmount) * 90), paymentCurrency || getFirstOrderCurrency(activeThread) || (activeThread as any)?.service?.currency || activeThread?.provider?.preferred_currency || 'USD')}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t("provider.notes_optional")}</label>
                <textarea value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} placeholder={t("provider.notes_placeholder")} rows={3} className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground resize-none dark:bg-[#1f1f1f] dark:border-white/10" />
              </div>
            </div>

            <div className="border-t border-border/50 px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="cursor-pointer">{t("common.cancel")}</Button>
              <Button onClick={submitPaymentRequest} disabled={!paymentAmount || submittingPayment} className="cursor-pointer">{submittingPayment ? t("common.saving") : t("provider.send_request")}</Button>
            </div>
          </div>
        </div>
      )}

      <ProviderDocumentRequestModal
        open={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        documentTitle={documentTitle}
        setDocumentTitle={setDocumentTitle}
        documentDescription={documentDescription}
        setDocumentDescription={setDocumentDescription}
        submittingDocument={submittingDocument}
        submitDocumentRequest={submitDocumentRequest}
        t={t}
      />

      <SendDocModal
        open={showSendDocModal}
        onClose={() => setShowSendDocModal(false)}
        providerDocs={providerDocs}
        loadingProviderDocs={loadingProviderDocs}
        selectedSendDoc={selectedSendDoc}
        setSelectedSendDoc={setSelectedSendDoc}
        sendDocPin={sendDocPin}
        setSendDocPin={setSendDocPin}
        sendDocPinValidated={sendDocPinValidated}
        sendDocValidatingPin={sendDocValidatingPin}
        validateSendDocPin={validateSendDocPin}
        sendDocumentToClient={sendDocumentToClient}
        sendingDoc={sendingDoc}
      />

      <ViewDocumentModal show={showViewDocumentModal} viewingSharedDocument={viewingSharedDocument} onClose={() => setShowViewDocumentModal(false)} viewPin={viewPin} setViewPin={setViewPin} viewPinValidating={viewPinValidating} onDecrypt={decryptSharedDocument} />
    </div>
  );
}
