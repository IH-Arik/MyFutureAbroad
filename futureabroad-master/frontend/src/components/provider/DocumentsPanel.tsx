import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth-context";
import { useToast } from "@/components/Toast";
import { Buffer } from "buffer";
import {
  generateRSAKeyPair,
  exportPublicKey,
  exportPrivateKey,
  importPublicKey,
  importPrivateKey,
  deriveAESKeyFromPIN,
  generateDocumentKey,
  encryptDocument,
  decryptDocument,
  encryptAESKeyWithRSA,
} from "@/lib/crypto";

import PinPanel from "@/components/documents/PinPanel";
import UploadForm from "@/components/documents/UploadForm";
import DocumentList from "@/components/documents/DocumentList";
import DocumentViewer from "@/components/documents/DocumentViewer";
import EditDocumentModal from "@/components/documents/EditDocumentModal";
import DeleteConfirmModal from "@/components/documents/DeleteConfirmModal";

export default function DocumentsPanel() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [documents, setDocuments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDecryptingId, setIsDecryptingId] = useState<string | null>(null);

  const [viewingDocument, setViewingDocument] = useState<any | null>(null);
  const [decryptedDocumentUrl, setDecryptedDocumentUrl] = useState<string | null>(null);

  const [isDeletingDocId, setIsDeletingDocId] = useState<string | null>(null);
  const [deleteConfirmDocId, setDeleteConfirmDocId] = useState<string | null>(null);

  const [editingDocument, setEditingDocument] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [hasDbKeys, setHasDbKeys] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  const [pin, setPin] = useState("");
  const [isProcessingKeys, setIsProcessingKeys] = useState(false);

  const refreshDocuments = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("documents")
      .select("*, document_categories(name)")
      .eq("user_id", user.id);
    if (data) setDocuments(data);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    supabase.from("document_categories").select("*").then(({ data }) => {
      if (data) setCategories(data);
    });

    refreshDocuments();

    supabase
      .from("user_keys")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setHasDbKeys(true);
      });
  }, [user, refreshDocuments]);

  const attemptKeySetup = async () => {
    if (!pin || pin.length < 4)
      return addToast("PIN must be at least 4 chars long to setup.", "warning");
    setIsProcessingKeys(true);
    try {
      const keyPair = await generateRSAKeyPair();
      const pubKeyBase64 = await exportPublicKey(keyPair.publicKey);
      const privKeyBase64 = await exportPrivateKey(keyPair.privateKey);

      const salt = crypto.getRandomValues(new Uint8Array(16));
      const saltStr = Buffer.from(salt).toString("base64");
      const derivedAESKey = await deriveAESKeyFromPIN(pin, saltStr);

      const privKeyBuffer = new TextEncoder().encode(privKeyBase64).buffer as ArrayBuffer;
      const encryptedPrivKeyBuffer = await encryptDocument(privKeyBuffer, derivedAESKey);
      const encryptedPrivKeyBase64 = Buffer.from(encryptedPrivKeyBuffer).toString("base64");

      const { error } = await supabase.from("user_keys").insert({
        user_id: user?.id,
        public_key: pubKeyBase64,
        salt: saltStr,
        encrypted_private_key: encryptedPrivKeyBase64,
      });
      if (error) throw error;

      setHasDbKeys(true);
      setPrivateKey(keyPair.privateKey);
      setIsUnlocked(true);
      setPin("");
    } catch (e) {
      console.error(e);
      addToast("Failed to setup keys.", "error");
    }
    setIsProcessingKeys(false);
  };

  const attemptKeyUnlock = async () => {
    if (!pin) return addToast("Enter your PIN to unlock.", "warning");
    setIsProcessingKeys(true);
    try {
      const { data, error } = await supabase
        .from("user_keys")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      if (error || !data) throw new Error("Could not fetch user keys");

      const derivedAESKey = await deriveAESKeyFromPIN(pin, data.salt);
      const encryptedPrivKeyBuffer = Buffer.from(data.encrypted_private_key, "base64").buffer as ArrayBuffer;

      const decryptedPrivKeyBuffer = await decryptDocument(encryptedPrivKeyBuffer, derivedAESKey);
      const privKeyBase64 = new TextDecoder().decode(decryptedPrivKeyBuffer);

      const importedPrivKey = await importPrivateKey(privKeyBase64);
      setPrivateKey(importedPrivKey);
      setIsUnlocked(true);
      setPin("");
    } catch (e) {
      console.error(e);
      addToast("Incorrect PIN or unable to unlock keys.", "error");
    }
    setIsProcessingKeys(false);
  };

  const uploadFile = async () => {
    if (!file || !selectedCategory) return addToast("Select a file and category", "warning");
    if (!isUnlocked || !privateKey) return addToast("You must unlock your vault first.", "warning");
    setIsUploading(true);

    try {
      const { data: keyData } = await supabase
        .from("user_keys")
        .select("public_key")
        .eq("user_id", user?.id)
        .single();
      if (!keyData) throw new Error("No public key found in DB");

      const aesKey = await generateDocumentKey();
      const fileBuffer = await file.arrayBuffer();

      const encryptedFileArray = await encryptDocument(fileBuffer, aesKey);
      const filePath = `${user?.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

      await supabase.storage.from("documents").upload(filePath, encryptedFileArray);

      const { data: docData, error: docError } = await supabase
        .from("documents")
        .insert({
          user_id: user?.id,
          category_id: selectedCategory,
          name: file.name,
          file_path: filePath,
          content_type: file.type,
        })
        .select()
        .single();
      if (docError) throw docError;

      const userPubKey = await importPublicKey(keyData.public_key);
      const encryptedAESKeyStr = await encryptAESKeyWithRSA(aesKey, userPubKey);

      await supabase.from("document_access").insert({
        document_id: docData.id,
        user_id: user?.id,
        encrypted_aes_key: encryptedAESKeyStr,
      });

      setFile(null);
      refreshDocuments();
      addToast("Document securely uploaded and encrypted.", "success");
    } catch (e) {
      console.error("Upload error:", e);
      addToast("Failed to upload the encrypted document.", "error");
    }
    setIsUploading(false);
  };

  const downloadAndDecryptFile = async (doc: any) => {
    if (!isUnlocked || !privateKey) return addToast("You must unlock your vault first.", "warning");
    setIsDecryptingId(doc.id);
    try {
      const { data: accessData, error: accessError } = await supabase
        .from("document_access")
        .select("encrypted_aes_key")
        .eq("document_id", doc.id)
        .eq("user_id", user?.id)
        .single();

      if (accessError || !accessData) throw new Error("You do not have the access keys for this document.");

      const encryptedAESBuffer = Buffer.from(accessData.encrypted_aes_key, "base64");
      const rawAESKey = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, encryptedAESBuffer);
      const aesKey = await crypto.subtle.importKey("raw", rawAESKey, { name: "AES-GCM", length: 256 }, true, [
        "encrypt",
        "decrypt",
      ]);

      const { data: blobData, error: downloadError } = await supabase.storage.from("documents").download(doc.file_path);
      if (downloadError || !blobData) throw new Error("Failed to download raw blob");

      const encryptedBuffer = await blobData.arrayBuffer();
      const decryptedBuffer = await decryptDocument(encryptedBuffer, aesKey);

      const blob = new Blob([decryptedBuffer], { type: doc.content_type });
      const url = URL.createObjectURL(blob);
      setViewingDocument(doc);
      setDecryptedDocumentUrl(url);
    } catch (e) {
      console.error(e);
      addToast("Failed to decrypt the document. " + (e as Error).message, "error");
    }
    setIsDecryptingId(null);
  };

  const closeDocument = () => {
    if (decryptedDocumentUrl) URL.revokeObjectURL(decryptedDocumentUrl);
    setViewingDocument(null);
    setDecryptedDocumentUrl(null);
  };

  const openEditModal = (doc: any) => {
    setEditingDocument(doc);
    setEditName(doc.name);
    setEditCategory(doc.category_id);
  };

  const closeEditModal = () => {
    setEditingDocument(null);
    setEditName("");
    setEditCategory("");
    setIsSavingEdit(false);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return addToast("Name cannot be empty", "warning");
    if (!editCategory) return addToast("Please select a category", "warning");

    setIsSavingEdit(true);
    try {
      const { error } = await supabase
        .from("documents")
        .update({ name: editName, category_id: editCategory })
        .eq("id", editingDocument.id)
        .eq("user_id", user?.id);
      if (error) throw error;

      refreshDocuments();
      closeEditModal();
    } catch (e) {
      console.error(e);
      addToast("Failed to save changes", "error");
    }
    setIsSavingEdit(false);
  };

  const confirmDelete = (docId: string) => setDeleteConfirmDocId(docId);

  const deleteDocument = async (docId: string) => {
    setDeleteConfirmDocId(null);
    setIsDeletingDocId(docId);
    try {
      const doc = documents.find((d) => d.id === docId);
      if (doc?.file_path) {
        await supabase.storage.from("documents").remove([doc.file_path]);
      }

      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", docId)
        .eq("user_id", user?.id);
      if (error) throw error;

      refreshDocuments();
      closeEditModal();
      addToast("Document deleted successfully", "success");
    } catch (e) {
      console.error(e);
      addToast("Failed to delete document", "error");
    }
    setIsDeletingDocId(null);
  };

  return (
    <div className="p-6">
      {/* PIN Entry / Locked State */}
      {!isUnlocked && (
        <PinPanel
          hasDbKeys={hasDbKeys}
          pin={pin}
          setPin={setPin}
          isProcessingKeys={isProcessingKeys}
          attemptKeyUnlock={attemptKeyUnlock}
          attemptKeySetup={attemptKeySetup}
        />
      )}

      {/* Upload Container (Requires unlock) */}
      {isUnlocked && (
        <UploadForm
          file={file}
          setFile={setFile}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isUploading={isUploading}
          uploadFile={uploadFile}
          categories={categories}
          onRefreshCategories={() => {
            supabase.from("document_categories").select("*").then(({ data }) => {
              if (data) setCategories(data);
            });
          }}
        />
      )}

      {/* Document Listing Container */}
      <DocumentList
        documents={documents}
        isUnlocked={isUnlocked}
        isDecryptingId={isDecryptingId}
        downloadAndDecryptFile={downloadAndDecryptFile}
        openEditModal={openEditModal}
      />

      {/* Document Viewer Modal */}
      {viewingDocument && decryptedDocumentUrl && (
        <DocumentViewer
          viewingDocument={viewingDocument}
          decryptedDocumentUrl={decryptedDocumentUrl}
          closeDocument={closeDocument}
        />
      )}

      {/* Edit Modal */}
      {editingDocument && (
        <EditDocumentModal
          editingDocument={editingDocument}
          categories={categories}
          editName={editName}
          setEditName={setEditName}
          editCategory={editCategory}
          setEditCategory={setEditCategory}
          isSavingEdit={isSavingEdit}
          isDeletingDocId={isDeletingDocId}
          confirmDelete={confirmDelete}
          closeEditModal={closeEditModal}
          saveEdit={saveEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDocId && (
        <DeleteConfirmModal
          deleteConfirmDocId={deleteConfirmDocId}
          setDeleteConfirmDocId={setDeleteConfirmDocId}
          deleteDocument={deleteDocument}
          isDeletingDocId={isDeletingDocId}
        />
      )}
    </div>
  );
}
