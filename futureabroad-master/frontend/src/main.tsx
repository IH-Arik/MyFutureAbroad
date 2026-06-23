import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import "./i18n/index"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { AuthProvider } from "@/components/auth-context.tsx"
import { CurrencyProvider } from "@/components/currency/CurrencyProvider";
import { CookieConsentProvider } from "@/components/CookieConsentProvider";
import { ToastProvider } from "@/components/Toast.tsx"
import { ToastContainer } from "@/components/ToastContainer.tsx";

import { HomePage } from "@/pages/HomePage.tsx";
import { VisasPage } from "@/pages/VisasPage.tsx";
import { VisaPage } from "@/pages/VisaPage.tsx";
import { CountryPage } from "@/pages/CountryPage.tsx";
import { CountriesPage } from "@/pages/CountriesPage.tsx";
import { ServicesPage } from "@/pages/ServicesPage.tsx";
import { ServiceCategory } from "@/pages/ServiceCategory.tsx";
import { ServicePage } from "@/pages/Service.tsx";
import { InsurancePage } from "@/pages/InsurancePage.tsx";
import { MailPage } from "@/pages/MailPage.tsx";
import { VpnPage } from "@/pages/VpnPage.tsx";
import { MondlyPage } from "@/pages/MondlyPage.tsx";
import { ResourcesPage } from "@/pages/ResourcesPage.tsx";
import { ResourcePage } from "@/pages/ResourcePage.tsx";
import { SupportPage } from "@/pages/SupportPage";
import { TravelPage } from "@/pages/TravelPage";
import { LoginPage } from "@/pages/LoginPage.tsx";
import { SignupPage } from "@/pages/SignupPage.tsx";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import { OrdersPage } from "@/pages/OrdersPage.tsx";
import { DocumentsPage } from "@/pages/DocumentsPage.tsx";
import { BudgetsPage } from "@/pages/BudgetsPage.tsx";
import { BudgetProfile } from "@/pages/BudgetProfile.tsx";
import { CheckListsPage } from "@/pages/CheckListsPage.tsx";
import { CheckListProfile } from "@/pages/CheckListProfile.tsx";
import { MessagesPage } from "@/pages/MessagesPage.tsx";
import { ProviderHome, ProviderBusinessDashboard } from "@/pages/ProviderDashboard.tsx";
import { OnboardingCallback } from "@/pages/OnboardingCallback.tsx";
import { TermsPage } from "@/pages/TermsPage.tsx";
import { PrivacyPage } from "@/pages/PrivacyPage.tsx";
import { ToolsPage } from "@/pages/ToolsPage.tsx";
import { MyAccount } from "@/pages/MyAccount.tsx";
import { VisaFinderPage } from "@/pages/VisaFinderPage.tsx";
import { TranslationServicePage } from "@/pages/TranslationServicePage.tsx";
import { TaxCalculatorPage } from "@/pages/TaxCalculatorPage.tsx";
import { ChatsPage } from "@/pages/ChatsPage.tsx";
import { Layout } from "@/components/Layout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <CurrencyProvider>
      <CookieConsentProvider>
      <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/visas" element={<VisasPage />} />
              <Route path="/visas/:id" element={<VisaPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:categoryId" element={<ServiceCategory />} />
              <Route path="/services/:categoryId/:serviceId" element={<ServicePage />} />
              <Route path="/insurance" element={<InsurancePage />} />
              <Route path="/mail" element={<MailPage />} />
              <Route path="/vpn" element={<VpnPage />} />
              <Route path="/mondly" element={<MondlyPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/resources/:id" element={<ResourcePage />} />
              <Route path="/countries" element={<CountriesPage />} />
              <Route path="/countries/:countryId" element={<CountryPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/travel" element={<TravelPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/budgets" element={<BudgetsPage />} />
              <Route path="/budgets/:budgetId" element={<BudgetProfile />} />
              <Route path="/checklists" element={<CheckListsPage />} />
              <Route path="/checklists/:checklistId" element={<CheckListProfile />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/account" element={<MyAccount />} />
              <Route path="/visa-finder" element={<VisaFinderPage />} />
              <Route path="/translation" element={<TranslationServicePage />} />
              <Route path="/tax-calculator" element={<TaxCalculatorPage />} />
              <Route path="/chats" element={<ChatsPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingCallback />} />
            <Route path="/provider" element={<ProviderHome />} />
            <Route path="/provider/:providerId" element={<ProviderBusinessDashboard />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </ToastProvider>
      </CookieConsentProvider>
      </CurrencyProvider>
    </ThemeProvider>
  </StrictMode>
)
