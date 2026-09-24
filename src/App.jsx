import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import facultyDeskLogo from "./assets/faculty-desk-logo.png";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://hod-availability-backend.onrender.com";

const reportCellStyle = {
  padding: "10px",
  border: "1px solid #e2e8f0",
  textAlign: "left",
  verticalAlign: "top",
  color: "#334155",
};

const reportSummaryStyle = {
  padding: "14px",
  borderRadius: "10px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  color: "#0f172a",
};

const GLOBAL_STYLES = `
* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
}

body {
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Arial,
    sans-serif;
}

button,
input {
  font-family: inherit;
}

button {
  cursor: pointer;
}
`;

const HOME_STYLES = `
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 10%, rgba(79,70,229,.20), transparent 30%),
    radial-gradient(circle at 90% 15%, rgba(14,165,233,.18), transparent 28%),
    linear-gradient(135deg, #eef2ff, #f8fbff, #eef8ff);
}

.home-header {
  width: 100%;
  padding: 22px 6%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faculty-desk-logo {
  width: 280px;
  max-width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}
.brand {
  display: flex;
  align-items: center;
  gap: 13px;
}

.brand-logo {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #4f46e5, #2563eb);
  box-shadow: 0 10px 25px rgba(37,99,235,.25);
}

.brand-title {
  font-size: 17px;
  font-weight: 800;
  color: #172554;
}

.brand-subtitle {
  margin-top: 2px;
  font-size: 11px;
  color: #64748b;
}

.system-pill {
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,.75);
  border: 1px solid rgba(148,163,184,.22);
  color: #475569;
  font-size: 12px;
  font-weight: 700;
}

.home-content {
  width: 100%;
  max-width: 1120px;
  margin: auto;
  padding: 35px 24px 55px;
}

.hero {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 38px;
}

.hero-badge {
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,.78);
  color: #4f46e5;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 18px;
}

.hero h1 {
  margin: 0;
  font-size: clamp(36px, 6vw, 62px);
  line-height: 1.04;
  letter-spacing: -2.5px;
  color: #172554;
}

.hero h1 span {
  background: linear-gradient(90deg, #4f46e5, #2563eb, #0891b2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero p {
  max-width: 620px;
  margin: 18px auto 0;
  color: #64748b;
  font-size: 16px;
  line-height: 1.7;
}

.login-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.login-option {
  position: relative;
  background: rgba(255,255,255,.88);
  border: 1px solid rgba(148,163,184,.18);
  border-radius: 24px;
  padding: 28px;
  cursor: pointer;
  box-shadow: 0 18px 45px rgba(15,23,42,.08);
  transition: transform .25s ease, box-shadow .25s ease;
  overflow: hidden;
}

.login-option:hover {
  transform: translateY(-7px);
  box-shadow: 0 25px 55px rgba(15,23,42,.13);
}

.login-option::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4f46e5, #2563eb);
}

.login-option.faculty::before {
  background: linear-gradient(90deg, #0891b2, #06b6d4);
}

.login-option.admin::before {
  background: linear-gradient(90deg, #7c3aed, #a855f7);
}

.option-icon {
  width: 56px;
  height: 56px;
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  margin-bottom: 22px;
  background: #eef2ff;
}

.faculty .option-icon {
  background: #ecfeff;
}

.admin .option-icon {
  background: #f5f3ff;
}

.option-label {
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.option-title {
  margin: 7px 0 0;
  color: #172554;
  font-size: 23px;
  font-weight: 800;
}

.option-description {
  margin: 9px 0 22px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
  min-height: 42px;
}

.option-button {
  width: 100%;
  border: none;
  border-radius: 13px;
  padding: 13px 16px;
  font-size: 14px;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, #4f46e5, #2563eb);
}

.faculty .option-button {
  background: linear-gradient(135deg, #0891b2, #0284c7);
}

.admin .option-button {
  background: linear-gradient(135deg, #7c3aed, #9333ea);
}

.home-footer {
  text-align: center;
  padding: 22px;
  color: #94a3b8;
  font-size: 11px;
}

.home-footer strong {
  color: #64748b;
}

.login-option.student::before {
  background: linear-gradient(90deg, #059669, #10b981);
}

.student .option-icon {
  background: #ecfdf5;
}

.student .option-button {
  background: linear-gradient(135deg, #059669, #0d9488);
}

@media (max-width: 850px) {
  .login-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: auto;
  }

  .system-pill {
    display: none;
  }
}

@media (max-width: 480px) {
  .home-header {
    padding: 18px 20px;
  }

  .hero h1 {
    font-size: 40px;
  }

  .hero p {
    font-size: 14px;
  }

  .login-option {
    padding: 23px;
  }
}
`;

const FACULTY_STYLES = `
.faculty-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25px;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 10% 15%, rgba(6,182,212,.18), transparent 30%),
    radial-gradient(circle at 90% 85%, rgba(37,99,235,.18), transparent 32%),
    linear-gradient(135deg, #ecfeff, #f8fafc, #eff6ff);
}

.faculty-bg-circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.faculty-circle-one {
  width: 280px;
  height: 280px;
  top: -130px;
  right: -100px;
  background: rgba(6,182,212,.10);
}

.faculty-circle-two {
  width: 230px;
  height: 230px;
  bottom: -110px;
  left: -80px;
  background: rgba(37,99,235,.10);
}

.faculty-login-wrapper {
  width: 100%;
  max-width: 950px;
  min-height: 570px;
  display: grid;
  grid-template-columns: .9fr 1.1fr;
  background: rgba(255,255,255,.94);
  border: 1px solid rgba(148,163,184,.18);
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  z-index: 2;
  box-shadow: 0 30px 80px rgba(15,23,42,.14);
}

.faculty-brand-panel {
  padding: 45px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(145deg, #0891b2, #0284c7, #2563eb);
  position: relative;
  overflow: hidden;
}

.faculty-brand-panel::before {
  content: "";
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: rgba(255,255,255,.08);
  top: -120px;
  right: -120px;
}

.faculty-brand-panel::after {
  content: "";
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(255,255,255,.06);
  bottom: -100px;
  left: -90px;
}

.faculty-brand-content,
.faculty-feature-list {
  position: relative;
  z-index: 2;
}

.faculty-brand-icon {
  width: 64px;
  height: 64px;
  border-radius: 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-bottom: 25px;
  background: rgba(255,255,255,.16);
  border: 1px solid rgba(255,255,255,.20);
}

.faculty-brand-panel h2 {
  margin: 0;
  font-size: 31px;
  line-height: 1.15;
}

.faculty-brand-panel p {
  margin: 15px 0 0;
  color: rgba(255,255,255,.82);
  font-size: 14px;
  line-height: 1.7;
}

.faculty-feature-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.faculty-feature {
  display: flex;
  align-items: center;
  gap: 11px;
  color: rgba(255,255,255,.9);
  font-size: 12px;
  font-weight: 600;
}

.faculty-feature-check {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,.15);
}

.faculty-form-panel {
  padding: 48px 52px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.faculty-form-top {
  margin-bottom: 28px;
}

.faculty-welcome {
  color: #0891b2;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.3px;
  margin-bottom: 8px;
}

.faculty-form-panel h1 {
  margin: 0;
  color: #0f172a;
  font-size: 34px;
}

.faculty-form-subtitle {
  margin: 9px 0 0;
  color: #64748b;
  font-size: 14px;
}

.faculty-field {
  margin-bottom: 19px;
}

.faculty-field label {
  display: block;
  color: #334155;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 8px;
}

.faculty-input-wrapper {
  position: relative;
}

.faculty-input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
  .faculty-input {
  width: 100%;
  height: 51px;
  border-radius: 13px;
  border: 1px solid #dbe3ed;
  background: #f8fafc;
  padding: 0 15px 0 45px;
  outline: none;
  font-size: 14px;
}

.faculty-input:focus {
  background: white;
  border-color: #06b6d4;
  box-shadow: 0 0 0 4px rgba(6,182,212,.10);
}

.faculty-login-error {
  padding: 11px 13px;
  border-radius: 11px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
}

.faculty-login-button {
  width: 100%;
  height: 51px;
  border: none;
  border-radius: 13px;
  background: linear-gradient(135deg, #0891b2, #0284c7, #2563eb);
  color: white;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(2,132,199,.22);
}

.faculty-login-button:disabled {
  opacity: .65;
  cursor: not-allowed;
}

.faculty-back-button {
  width: 100%;
  margin-top: 13px;
  height: 45px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}

.faculty-security-note {
  margin-top: 23px;
  padding-top: 17px;
  border-top: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 11px;
}

@media (max-width: 800px) {
  .faculty-login-wrapper {
    grid-template-columns: 1fr;
    max-width: 500px;
  }

  .faculty-brand-panel {
    padding: 30px;
    min-height: 230px;
  }

  .faculty-feature-list {
    display: none;
  }

  .faculty-form-panel {
    padding: 35px 30px;
  }
}

@media (max-width: 480px) {
  .faculty-login-page {
    padding: 15px;
  }

  .faculty-login-wrapper {
    border-radius: 23px;
  }

  .faculty-brand-panel {
    padding: 25px;
  }

  .faculty-form-panel {
    padding: 30px 22px;
  }

  .faculty-form-panel h1 {
    font-size: 29px;
  }
}
`;

const COMMON_LOGIN_STYLES = `
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background:
    radial-gradient(circle at top right, rgba(79,70,229,.18), transparent 35%),
    linear-gradient(135deg, #eef2ff, #f8fafc);
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255,255,255,.96);
  padding: 34px;
  border-radius: 25px;
  border: 1px solid rgba(148,163,184,.18);
  box-shadow: 0 25px 70px rgba(15,23,42,.12);
}

.login-card h1 {
  color: #172554;
  margin: 0 0 8px;
}

.login-subtitle {
  color: #64748b;
  margin-bottom: 25px;
}

.login-card label {
  display: block;
  margin: 14px 0 7px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.login-card input {
  width: 100%;
  padding: 13px 14px;
  border-radius: 11px;
  border: 1px solid #dbe3ef;
  outline: none;
  font-size: 14px;
}

.login-card button {
  width: 100%;
  border: none;
  border-radius: 11px;
  padding: 13px;
  margin-top: 12px;
  color: white;
  background: linear-gradient(135deg, #4f46e5, #2563eb);
  font-weight: 800;
  cursor: pointer;
}

.login-error {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #b91c1c;
  background: #fef2f2;
  font-size: 13px;
}
`;
const FACULTY_DASHBOARD_STYLES = `
.faculty-dashboard-page {
  min-height: 100vh;
  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(37, 99, 235, 0.10),
      transparent 28%
    ),
    radial-gradient(
      circle at 90% 10%,
      rgba(124, 58, 237, 0.08),
      transparent 28%
    ),
    #f1f5f9;
  padding: 0 !important;
  align-items: stretch !important;
}

.faculty-dashboard-shell {
  width: 100%;
  max-width: 1400px;
  min-height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.faculty-dashboard-main {
  width: 100%;
  padding: 28px 34px 50px;
}

.faculty-dashboard-card {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.faculty-dashboard-topbar {
  min-height: 76px;
  padding: 14px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
}

.faculty-dashboard-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.faculty-dashboard-brand img {
  width: 150px;
  height: auto;
  display: block;
}

.faculty-dashboard-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.faculty-dashboard-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 800;
  background: linear-gradient(
    135deg,
    #2563eb,
    #7c3aed
  );
}

.faculty-dashboard-user-name {
  color: #0f172a;
  font-size: 13px;
  font-weight: 800;
}

.faculty-dashboard-user-role {
  margin-top: 2px;
  color: #64748b;
  font-size: 11px;
}

.faculty-dashboard-logout {
  border: 1px solid #fecaca;
  border-radius: 9px;
  padding: 9px 14px;
  background: #fff;
  color: #dc2626;
  font-size: 12px;
  font-weight: 800;
}

.faculty-dashboard-logout:hover {
  background: #fef2f2;
}

.faculty-dashboard-welcome {
  margin-bottom: 24px;
}

.faculty-dashboard-welcome-label {
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.faculty-dashboard-welcome h1 {
  margin: 6px 0 4px;
  color: #0f172a;
  font-size: 30px;
  font-weight: 800;
}

.faculty-dashboard-welcome p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.faculty-dashboard-info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.faculty-info-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  padding: 17px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.faculty-info-label {
  color: #64748b;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .7px;
}

.faculty-info-value {
  margin-top: 6px;
  color: #0f172a;
  font-size: 17px;
  font-weight: 800;
}

.faculty-info-subtitle {
  margin-top: 4px;
  color: #64748b;
  font-size: 11px;
}

@media (max-width: 850px) {
  .faculty-dashboard-main {
    padding: 20px 16px 35px;
  }

  .faculty-dashboard-info {
    grid-template-columns: 1fr;
  }

  .faculty-dashboard-topbar {
    padding: 12px 16px;
  }

  .faculty-dashboard-brand img {
    width: 125px;
  }

  .faculty-dashboard-user-role {
    display: none;
  }
}

@media (max-width: 560px) {
  .faculty-dashboard-user-name {
    display: none;
  }

  .faculty-dashboard-logout {
    padding: 8px 10px;
  }

  .faculty-dashboard-welcome h1 {
    font-size: 25px;
  }
}
`;

const FACULTY_DASHBOARD_PRO_STYLES = `
.fd-dashboard-root {
  min-height: 100vh;
  display: flex;
  background: #f4f7fb;
  color: #0f172a;
}
.fd-sidebar {
  width: 245px;
  min-height: 100vh;
  position: sticky;
  top: 0;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  padding: 22px 14px;
  background: linear-gradient(180deg, #0b1f3a 0%, #102a4c 55%, #0b1b34 100%);
  color: white;
}
.fd-sidebar-brand { padding: 4px 10px 28px; }
.fd-sidebar-brand img { width: 178px; max-width: 100%; height: auto; display: block; }
.fd-sidebar-label { margin: 4px 12px 12px; color: #94a3b8; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
.fd-sidebar-nav { display: flex; flex-direction: column; gap: 6px; }
.fd-sidebar-btn {
  width: 100%; border: 0; border-radius: 10px; padding: 12px 13px; background: transparent; color: #dbeafe;
  display: flex; align-items: center; gap: 12px; text-align: left; font-size: 13px; font-weight: 700; cursor: pointer;
}
.fd-sidebar-btn:hover, .fd-sidebar-btn.active { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; box-shadow: 0 8px 20px rgba(37,99,235,.25); }
.fd-sidebar-icon { width: 22px; text-align: center; font-size: 16px; }
.fd-sidebar-spacer { flex: 1; }
.fd-sidebar-support { border-top: 1px solid rgba(148,163,184,.18); padding-top: 18px; margin-top: 18px; }
.fd-sidebar-logout { margin-top: 18px; width: 100%; border: 1px solid rgba(255,255,255,.12); border-radius: 10px; padding: 11px; background: rgba(255,255,255,.07); color: white; font-weight: 800; cursor: pointer; }
.fd-sidebar-logout:hover { background: rgba(239,68,68,.18); }
.fd-content { min-width: 0; flex: 1; }
.fd-topbar {
  height: 76px; padding: 0 30px; background: rgba(255,255,255,.96); border-bottom: 1px solid #e2e8f0;
  display: flex; align-items: center; justify-content: space-between; gap: 18px; position: sticky; top: 0; z-index: 20;
}
.fd-topbar-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
.fd-menu { display: none; border: 0; background: transparent; font-size: 22px; color: #1e3a8a; }
.fd-search { width: min(420px, 45vw); padding: 11px 16px 11px 42px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; outline: none; font-size: 13px; }
.fd-search-wrap { position: relative; }
.fd-search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #64748b; }
.fd-profile { display: flex; align-items: center; gap: 11px; }
.fd-avatar { width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; color: white; font-weight: 800; background: linear-gradient(135deg,#2563eb,#7c3aed); }
.fd-profile-name { font-size: 13px; font-weight: 800; color: #0f172a; }
.fd-profile-role { font-size: 11px; color: #64748b; margin-top: 2px; }
.fd-notification { font-size: 19px; position: relative; }
.fd-notification::after { content: ''; position: absolute; width: 7px; height: 7px; background: #ef4444; border-radius: 50%; right: -2px; top: 0; border: 2px solid white; }
.fd-main { padding: 28px 34px 50px; max-width: 1500px; margin: 0 auto; }
.fd-welcome { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
.fd-eyebrow { color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
.fd-welcome h1 { margin: 6px 0 4px; color: #102a5a; font-size: 31px; line-height: 1.1; }
.fd-welcome p { margin: 0; color: #64748b; font-size: 13px; }
.fd-date-card { min-width: 215px; padding: 13px 16px; border: 1px solid #e2e8f0; border-radius: 14px; background: white; display: flex; gap: 12px; align-items: center; box-shadow: 0 6px 18px rgba(15,23,42,.04); }
.fd-date-icon { width: 38px; height: 38px; border-radius: 10px; background: #eff6ff; display: grid; place-items: center; font-size: 18px; }
.fd-date-main { font-weight: 800; color: #0f172a; font-size: 13px; }
.fd-date-sub { margin-top: 3px; color: #64748b; font-size: 11px; }
.fd-overview { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 16px; margin-bottom: 24px; }
.fd-overview-card { min-height: 118px; border-radius: 16px; padding: 18px; background: white; border: 1px solid #e2e8f0; box-shadow: 0 8px 24px rgba(15,23,42,.05); display: flex; gap: 14px; align-items: center; }
.fd-overview-icon { width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; font-size: 21px; flex: 0 0 auto; }
.fd-overview-label { color: #334155; font-size: 12px; font-weight: 700; }
.fd-overview-value { margin-top: 6px; font-size: 21px; font-weight: 900; color: #102a5a; }
.fd-overview-sub { margin-top: 4px; color: #64748b; font-size: 11px; }
.fd-status-green .fd-overview-icon { background:#dcfce7; } .fd-status-blue .fd-overview-icon { background:#dbeafe; } .fd-status-purple .fd-overview-icon { background:#ede9fe; } .fd-status-orange .fd-overview-icon { background:#ffedd5; }
.fd-body-grid { display: grid; grid-template-columns: minmax(0,1.55fr) minmax(330px,.95fr); gap: 20px; align-items: start; }
.fd-section-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 8px 24px rgba(15,23,42,.05); }
.fd-section-title { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
.fd-section-title h2 { margin:0; color:#102a5a; font-size:19px; }
.fd-section-title button { border:1px solid #dbeafe; border-radius:999px; padding:8px 13px; background:#f8fbff; color:#2563eb; font-size:11px; font-weight:800; cursor:pointer; }
.fd-hidden-legacy { display:none !important; }
.fd-quick-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.fd-quick { border:1px solid #dbeafe; border-radius:13px; background:#f8fbff; padding:15px; text-align:left; cursor:pointer; }
.fd-quick strong { display:block; color:#172554; font-size:12px; } .fd-quick span { display:block; margin-top:5px; color:#64748b; font-size:11px; }
.fd-timetable-panel { margin-top: 0; }
.fd-sidebar-section-spacer { height: 1px; }
@media (max-width: 1100px) { .fd-overview { grid-template-columns: repeat(2,minmax(0,1fr)); } .fd-body-grid { grid-template-columns: 1fr; } }
@media (max-width: 800px) { .fd-sidebar { width: 205px; } .fd-main { padding:22px 18px 40px; } .fd-topbar { padding:0 18px; } .fd-date-card { display:none; } }
@media (max-width: 620px) { .fd-sidebar { display:none; } .fd-menu { display:block; } .fd-search { width: 52vw; } .fd-profile-name,.fd-profile-role { display:none; } .fd-overview { grid-template-columns:1fr; } .fd-welcome h1 { font-size:25px; } }
`;


const FACULTY_DESIGN_STYLES = `
.fd-professional-root {
  background: #f4f7fb;
}
.fd-sidebar-overlay {
  display: none;
}
.fd-sidebar {
  width: 248px;
  flex: 0 0 248px;
  background: linear-gradient(180deg, #0b1f3a 0%, #102a4c 52%, #091a30 100%);
  box-shadow: 8px 0 28px rgba(15, 23, 42, 0.08);
}
.fd-sidebar-brand {
  padding: 22px 16px 26px;
}
.fd-sidebar-brand img {
  width: 184px;
  max-width: 100%;
}
.fd-sidebar-label {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
  margin: 0 12px 10px;
  text-transform: uppercase;
}
.fd-sidebar-nav,
.fd-sidebar-support {
  gap: 5px;
}
.fd-sidebar-btn {
  min-height: 44px;
  border-radius: 11px;
  padding: 11px 13px;
  color: #cbd5e1;
  transition: all .18s ease;
}
.fd-sidebar-btn:hover {
  background: rgba(59,130,246,.13);
  color: #fff;
  transform: translateX(2px);
}
.fd-sidebar-btn.active {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  box-shadow: 0 9px 22px rgba(37,99,235,.25);
}
.fd-sidebar-icon {
  width: 24px;
  font-size: 17px;
}
.fd-sidebar-support {
  border-top: 1px solid rgba(148,163,184,.16);
  padding-top: 18px;
  margin-top: 18px;
}
.fd-sidebar-logout {
  margin-top: 16px;
  min-height: 44px;
  border-radius: 11px;
}
.fd-topbar {
  height: 74px;
  padding: 0 32px;
  background: rgba(255,255,255,.97);
  box-shadow: 0 1px 0 #e2e8f0;
}
.fd-topbar-left {
  gap: 16px;
}
.fd-page-heading-title {
  font-size: 14px;
  font-weight: 900;
  color: #102a5a;
}
.fd-page-heading-subtitle {
  margin-top: 2px;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
}
.fd-professional-main {
  max-width: 1600px;
  padding: 30px 34px 54px;
}
.fd-page-intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}
.fd-page-intro h1 {
  margin: 5px 0 5px;
  color: #102a5a;
  font-size: 30px;
  line-height: 1.15;
  letter-spacing: -.5px;
}
.fd-page-intro p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}
.fd-overview-card {
  min-height: 126px;
  border-radius: 16px;
}
.fd-status-red .fd-overview-icon {
  background: #fee2e2;
  color: #dc2626;
}
.fd-status-green .fd-overview-icon { color: #16a34a; }
.fd-status-blue .fd-overview-icon { color: #2563eb; }
.fd-status-purple .fd-overview-icon { color: #7c3aed; }
.fd-status-orange .fd-overview-icon { color: #ea580c; }
.fd-dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, .75fr);
  gap: 18px;
  margin-bottom: 18px;
}

.fd-dashboard-grid-single {
  grid-template-columns: minmax(0, 1fr) !important;
}
.fd-dashboard-grid-single .fd-welcome-card {
  width: 100%;
}
.fd-section-card {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 7px 24px rgba(15,23,42,.045);
}
.fd-welcome-card,
.fd-status-panel,
.fd-quick-section {
  padding: 22px;
}
.fd-card-kicker {
  display: block;
  color: #64748b;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.2px;
  margin-bottom: 5px;
}
.fd-section-title h2 {
  font-size: 18px;
}
.fd-card-description {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.65;
}
.fd-dashboard-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}
.fd-primary-action,
.fd-secondary-action {
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}
.fd-primary-action {
  border: 0;
  color: #fff;
  background: #2563eb;
}
.fd-secondary-action {
  border: 1px solid #dbeafe;
  color: #1d4ed8;
  background: #f8fbff;
}
.fd-status-panel {
  background: linear-gradient(145deg, #ffffff, #f8fbff);
}
.fd-status-message {
  margin-top: 15px;
  padding: 13px;
  border-radius: 10px;
  background: #f8fafc;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
}
.fd-status-detail {
  margin-top: 9px;
  color: #64748b;
  font-size: 11px;
}
.fd-live-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 5px #fee2e2;
}
.fd-live-dot.green {
  background: #22c55e;
  box-shadow: 0 0 0 5px #dcfce7;
}
.fd-quick-section {
  margin-bottom: 18px;
}
.fd-quick-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.fd-quick {
  min-height: 92px;
  border: 1px solid #e2e8f0;
  background: #fff;
  transition: all .18s ease;
}
.fd-quick:hover {
  border-color: #bfdbfe;
  background: #f8fbff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37,99,235,.08);
}
.fd-page-section {
  min-width: 0;
}
.fd-page-section > #faculty-timetable-section,
.fd-page-section > #faculty-leave-section,
.fd-page-section > #faculty-task-section,
.fd-page-section > #faculty-report-section {
  margin-top: 0 !important;
}
/* Professional vertical timetable */
.fd-period-grid-wrap {
  width: 100%;
  overflow: visible;
  padding: 2px 0 4px;
}
.fd-period-grid {
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  width: 100%;
  min-width: 0 !important;
}
.fd-period-card {
  width: 100%;
  min-height: 96px;
  height: auto;
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr) 52px;
  align-items: center;
  gap: 24px;
  position: relative;
  padding: 16px 18px !important;
  border-radius: 14px !important;
  border: 1px solid #dbe3ef !important;
  background: #fff !important;
  box-shadow: 0 3px 10px rgba(15,23,42,.045);
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}
.fd-period-card.has-class {
  background: linear-gradient(90deg,#f7fbff,#fff) !important;
  border-color: #bfdbfe !important;
}
.fd-period-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(15,23,42,.07);
}
.fd-period-top {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  padding: 0 18px 0 2px !important;
  border-right: 1px solid #e2e8f0 !important;
}
.fd-period-top strong {
  color: #172554;
  font-size: 17px;
  font-weight: 900;
}
.fd-period-time {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: -0.1px;
}
.fd-period-content {
  min-width: 0;
  min-height: 54px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0 !important;
}
.fd-class-subject {
  color: #172554;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.35;
}
.fd-class-meta {
  margin-top: 3px;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
}
.fd-class-room {
  margin-top: 2px;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
}
.fd-free-period {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #15803d;
  font-size: 13px;
  font-weight: 900;
}
.fd-free-dot {
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 4px #dcfce7;
}
.fd-period-actions {
  display: flex !important;
  align-items: center;
  justify-content: flex-end;
  margin: 0 !important;
}
.fd-period-menu-wrap {
  position: relative;
  display: flex;
  justify-content: center;
}
.fd-period-menu-button {
  width: 38px;
  height: 38px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  background: #fff;
  color: #475569;
  font-size: 21px;
  line-height: 1;
  cursor: pointer;
}
.fd-period-menu-button:hover {
  background: #eff6ff;
  border-color: #93c5fd;
  color: #2563eb;
}
.fd-period-menu {
  position: absolute;
  top: 43px;
  right: 0;
  width: 155px;
  padding: 6px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(15,23,42,.14);
  z-index: 100;
}
.fd-period-menu button {
  width: 100%;
  border: 0;
  border-radius: 7px;
  padding: 9px 10px;
  background: transparent;
  color: #334155;
  font-size: 11px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}
.fd-period-menu button:hover {
  background: #eff6ff;
  color: #2563eb;
}
.fd-period-menu .fd-period-menu-delete {
  color: #dc2626;
}
.fd-period-menu .fd-period-menu-delete:hover {
  background: #fef2f2;
  color: #b91c1c;
}
.fd-period-card > form {
  grid-column: 1 / -1;
  width: 100%;
  margin-top: 4px !important;
}
@media (max-width: 700px) {
  .fd-period-card {
    grid-template-columns: 120px minmax(0, 1fr) 44px;
    gap: 14px;
    padding: 12px 14px !important;
  }
  .fd-period-top {
    padding-right: 12px !important;
  }
  .fd-period-time {
    font-size: 10px;
  }
}
@media (max-width: 1100px) {
  .fd-dashboard-grid { grid-template-columns: 1fr; }
  .fd-quick-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
}
@media (max-width: 700px) {
  .fd-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    transform: translateX(-105%);
    transition: transform .2s ease;
  }
  .fd-sidebar.mobile-open { transform: translateX(0); }
  .fd-sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 999;
    background: rgba(15,23,42,.45);
  }
  .fd-menu { display: block !important; }
  .fd-topbar { padding: 0 16px; }
  .fd-professional-main { padding: 22px 16px 40px; }
  .fd-page-intro { display: block; }
  .fd-date-card { margin-top: 14px; }
  .fd-quick-grid { grid-template-columns: 1fr; }
  .fd-dashboard-actions { flex-direction: column; }
  .fd-primary-action,.fd-secondary-action { width: 100%; }
}
`;

function App() {
  const getInitialPage = () => {
    const path = window.location.pathname;

    if (path === "/admin") return "admin-login";
    if (path === "/faculty") return "faculty-login";
    if (path === "/viewer") return "viewer";
    if (path === "/student") return "student";

    return "home";
  };

  const [page, setPage] = useState(getInitialPage);

  // =========================
  // HOD
  // =========================
  const [hodId, setHodId] = useState("");
  const [hodPassword, setHodPassword] = useState("");
  const [hodError, setHodError] = useState("");
  const [hodLoading, setHodLoading] = useState(false);

  const [hodUser, setHodUser] = useState(() => {
    const saved = sessionStorage.getItem("hodUser");

    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [hodStatus, setHodStatus] = useState(null);
  const [hodStatusMessage, setHodStatusMessage] = useState("");
  const [hodExpectedReturn, setHodExpectedReturn] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [statusSuccess, setStatusSuccess] = useState("");

  // =========================
  // STUDENT PORTAL
  // =========================
  const [studentDepartments, setStudentDepartments] = useState([]);
  const [studentDepartment, setStudentDepartment] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

  // =========================
 // =========================
// FACULTY
// =========================

const [facultyId, setFacultyId] =
  useState("");

const [facultyPassword, setFacultyPassword] =
  useState("");

const [facultyError, setFacultyError] =
  useState("");

const [facultyLoading, setFacultyLoading] =
  useState(false);


const [facultyUser, setFacultyUser] =
  useState(() => {

    const saved =
      sessionStorage.getItem(
        "facultyUser"
      );

    if (!saved) return null;

    try {

      return JSON.parse(saved);

    } catch {

      return null;

    }

  });
  const [facultyCurrentStatus, setFacultyCurrentStatus] =
  useState(null);

  const [facultySection, setFacultySection] = useState("dashboard");
  const [facultySidebarOpen, setFacultySidebarOpen] = useState(false);
// =====================================================
// FACULTY LEAVE / HOLIDAY STATE
// =====================================================

const [facultySelectedDate, setFacultySelectedDate] =
  useState(
    new Date().toISOString().split("T")[0]
  );

const [facultyLeave, setFacultyLeave] =
  useState(null);

const [collegeHoliday, setCollegeHoliday] =
  useState(null);

const [facultyLeaveReason, setFacultyLeaveReason] =
  useState("");

const [holidayName, setHolidayName] =
  useState("");

const [holidayDescription, setHolidayDescription] =
  useState("");

const [leaveHolidayLoading, setLeaveHolidayLoading] =
  useState(false);
const taskDateBlocked =
  !!facultyLeave || !!collegeHoliday;
const [facultyStatusLoading, setFacultyStatusLoading] =
  useState(false);

const [facultyHodAvailability, setFacultyHodAvailability] =
  useState(null);

const [facultyHodLoading, setFacultyHodLoading] =
  useState(false);

const [facultyHodError, setFacultyHodError] =
  useState("");

// =========================
// FACULTY TIMETABLE
// =========================

const [facultyTimetable, setFacultyTimetable] = useState([]);
const [timetableDay, setTimetableDay] = useState("Monday");
const [timetableLoading, setTimetableLoading] = useState(false);
const [timetableError, setTimetableError] = useState("");
const [timetableSuccess, setTimetableSuccess] = useState("");
const [editingPeriod, setEditingPeriod] = useState(null);
const [openTimetableMenu, setOpenTimetableMenu] = useState(null);

const [facultyTasks, setFacultyTasks] = useState([]);
const [facultyTasksLoading, setFacultyTasksLoading] = useState(false);
const [facultyTasksError, setFacultyTasksError] = useState("");
const [facultyTasksSuccess, setFacultyTasksSuccess] = useState("");
const [editingTaskId, setEditingTaskId] = useState(null);
const [facultyReport, setFacultyReport] = useState(null);

// Report day status: Leave / Holiday dates must not show P1-P8 activity.
const [reportDayStatus, setReportDayStatus] = useState(null);

const generateFacultyReportPDF = async () => {
  if (!facultyReport) {
    alert("Please generate the report first.");
    return;
  }

  const doc = new jsPDF();

  const from = facultyReport.from || "";
  const to = facultyReport.to || "";

  const facultyName =
    facultyUser?.name ||
    facultyUser?.faculty_name ||
    "Faculty";

  const facultyId =
    facultyUser?.facultyId ||
    facultyUser?.faculty_id ||
    facultyUser?.username ||
    "";

  let department =
  facultyUser?.departmentName ||
  facultyUser?.department_name ||
  facultyUser?.departmentCode ||
  facultyUser?.department_code ||
  "";

if (!department && facultyUser?.departmentId) {
  try {
    const departmentResponse = await fetch(
      `${API_URL}/api/student/department/${facultyUser.departmentId}`
    );

    const departmentData =
      await departmentResponse.json();

    department =
      departmentData?.department?.name ||
      departmentData?.department?.code ||
      "";
  } catch (error) {
    console.error(
      "Unable to fetch department for PDF:",
      error
    );
  }
}

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Faculty Activity Report", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(`Faculty Name: ${facultyName}`, 14, 27);
  doc.text(`Faculty ID: ${facultyId}`, 14, 34);
  doc.text(`Department: ${department}`, 14, 41);
  doc.text(`Report Period: ${from} to ${to}`, 14, 48);

  // Leave/Holiday daily reports contain only the day status.
  // No timetable periods, tasks, or completion summary are shown.
  if (facultyReport.dayStatus) {
    const status = facultyReport.dayStatus;
    const isHoliday = status.type === "Holiday";

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, 60, 182, 48, 4, 4, "FD");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      isHoliday ? "COLLEGE HOLIDAY" : "FACULTY LEAVE",
      24,
      76
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      isHoliday
        ? `Holiday: ${status.name || "College Holiday"}`
        : "Faculty is on leave for this date.",
      24,
      88
    );

    if (status.reason) {
      doc.text(`Reason: ${status.reason}`, 24, 99);
    }

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(
      "P1-P8 timetable and task activity are not applicable for this date.",
      24,
      status.reason ? 105 : 99
    );

    doc.save(`Faculty_Report_${from}_${isHoliday ? "Holiday" : "Leave"}.pdf`);
    return;
  }

  const summary = facultyReport.summary || {};

  autoTable(doc, {
    startY: 56,
    head: [
      [
        "Total Tasks",
        "L1",
        "L2",
        "L3",
        "Completion",
      ],
    ],
    body: [
      [
        summary.totalTasks ?? 0,
        summary.l1Count ?? 0,
        summary.l2Count ?? 0,
        summary.l3Count ?? 0,
        `${summary.completionPercentage ?? 0}%`,
      ],
    ],
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fontStyle: "bold",
    },
  });

  let currentY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("P1-P8 Daily Activity", 14, currentY);

  currentY += 5;

  const periods = facultyReport.periods || [];

  if (periods.length > 0) {
    const periodRows = periods.map((period) => {
      let activity = period.activityType || "Free";
      let details = "";
      let status = "";

      if (activity === "Class") {
        details = [
          period.subject,
          period.className,
          period.section,
          period.room
            ? `Room: ${period.room}`
            : "",
        ]
          .filter(Boolean)
          .join(" | ");

        status = "CLASS";
      } else if (activity === "Task") {
        details = [
          period.taskName,
          period.taskDescription,
        ]
          .filter(Boolean)
          .join(" - ");

        status = period.statusLevel || "";
      } else {
        activity = "Free";
        details = "No class or task";
        status = "FREE";
      }

      return [
        `P${period.periodNo}`,
        period.time || "",
        activity,
        details,
        status,
      ];
    });

    autoTable(doc, {
      startY: currentY + 3,
      head: [
        [
          "Period",
          "Time",
          "Activity",
          "Details",
          "Status",
        ],
      ],
      body: periodRows,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 4,
        valign: "top",
      },
      headStyles: {
        fontStyle: "bold",
      },
    });

    currentY = doc.lastAutoTable.finalY + 12;
  } else {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(
      "P1-P8 period details are not available for this report.",
      14,
      currentY + 10
    );

    currentY += 22;
  }

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Task Details", 14, currentY);

  currentY += 5;

  const tasks = facultyReport.tasks || [];

  if (tasks.length > 0) {
    const taskRows = tasks.map((task) => [
      task.task_date || "",
      `P${task.period_no || ""}`,
      task.day_of_week || "",
      task.task_name || "",
      task.task_description || "",
      task.status_level || "",
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head: [
        [
          "Date",
          "Period",
          "Day",
          "Task",
          "Description",
          "Level",
        ],
      ],
      body: taskRows,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 4,
        valign: "top",
      },
      headStyles: {
        fontStyle: "bold",
      },
    });
  } else {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(
      "No tasks recorded for this report period.",
      14,
      currentY + 10
    );
  }

  const fileDate =
    from === to
      ? from
      : `${from}_to_${to}`;

  doc.save(
    `Faculty_Report_${fileDate || "Report"}.pdf`
  );
};

const [taskForm, setTaskForm] = useState({
  taskDate: "",
  dayOfWeek: "Monday",
  periodNo: "1",
  taskName: "",
  taskDescription: "",
  statusLevel: "L1",
});



const [timetableForm, setTimetableForm] = useState({
  subject: "",
  className: "",
  section: "",
  room: "",
});
// =========================
// FACULTY TIMETABLE SETTINGS
// =========================

const periodTimes = {
  1: ["09:15 AM", "10:05 AM"],
  2: ["10:05 AM", "10:55 AM"],
  3: ["10:55 AM", "11:45 AM"],
  4: ["11:45 AM", "12:35 PM"],
  5: ["01:30 PM", "02:20 PM"],
  6: ["02:20 PM", "03:10 PM"],
  7: ["03:10 PM", "04:00 PM"],
  8: ["04:00 PM", "04:50 PM"],
};

const timetableDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
  // =========================
  // STUDENT PORTAL
  // =========================

  const fetchStudentDepartments = async () => {
    try {
      setStudentError("");

      const response = await fetch(
        `${API_URL}/api/student/departments`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to fetch departments"
        );
      }

      setStudentDepartments(data || []);
    } catch (error) {
      console.error("Student departments error:", error);
      setStudentError("Unable to load departments.");
    }
  };

  const fetchStudentAvailability = async (departmentId) => {
    if (!departmentId) {
      setStudentData(null);
      return;
    }

    try {
      setStudentLoading(true);
      setStudentError("");

      const response = await fetch(
        `${API_URL}/api/student/department/${departmentId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to fetch availability"
        );
      }

      setStudentData(data);
    } catch (error) {
      console.error("Student availability error:", error);
      setStudentData(null);
      setStudentError(
        error.message || "Unable to load availability."
      );
    } finally {
      setStudentLoading(false);
    }
  };

  const openStudentPortal = () => {
    setPage("student");
    window.history.pushState({}, "", "/student");
  };

  // Load departments whenever the Student Portal is opened.
  // This also fixes direct navigation to /student, where
  // openStudentPortal() is not called.
  useEffect(() => {
    if (page !== "student") {
      return;
    }

    fetchStudentDepartments();
  }, [page]);

  const handleStudentDepartmentChange = (e) => {
    const departmentId = e.target.value;

    setStudentDepartment(departmentId);
    fetchStudentAvailability(departmentId);
  };

  const handleStudentRefresh = () => {
    if (studentDepartment) {
      fetchStudentAvailability(studentDepartment);
    }
  };

  // Automatically refresh the selected department availability every 15 seconds.
  useEffect(() => {
    if (page !== "student" || !studentDepartment) {
      return;
    }

    const interval = setInterval(() => {
      fetchStudentAvailability(studentDepartment);
    }, 15000);

    return () => clearInterval(interval);
  }, [page, studentDepartment]);

  // =========================
  // HOD LOGIN
  // =========================

  const handleHodLogin = async (e) => {
    e.preventDefault();
    setHodError("");

    if (!hodId || !hodPassword) {
      setHodError("Please enter HOD ID and password.");
      return;
    }

    setHodLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hodId,
            password: hodPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setHodError(
          data.error ||
            "Invalid HOD ID or password."
        );
        return;
      }

      sessionStorage.setItem(
        "hodToken",
        data.token
      );

      sessionStorage.setItem(
        "hodUser",
        JSON.stringify(data.user)
      );

      setHodUser(data.user);
      setPage("hod-dashboard");

      window.history.pushState(
        {},
        "",
        "/"
      );
    } catch (error) {
      console.error(
        "HOD login error:",
        error
      );

      setHodError(
        "Unable to connect to the server."
      );
    } finally {
      setHodLoading(false);
    }
  };

  // =========================
  // HOD LOGOUT
  // =========================

  const handleHodLogout = () => {
    sessionStorage.removeItem(
      "hodToken"
    );

    sessionStorage.removeItem(
      "hodUser"
    );

    setHodUser(null);
    setHodId("");
    setHodPassword("");
    setHodStatus(null);
    setHodStatusMessage("");
    setHodExpectedReturn("");
    setStatusError("");
    setStatusSuccess("");

    setPage("home");

    window.history.pushState(
      {},
      "",
      "/"
    );
  };

  // =========================
  // FETCH HOD STATUS
  // =========================

  const fetchHodStatus = async () => {
    try {
      const token =
        sessionStorage.getItem("hodToken");

      const response = await fetch(
        `${API_URL}/api/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setHodStatus(
          data.status ||
            "Available"
        );

        setHodStatusMessage("");



        setHodExpectedReturn(
          data.expectedReturnTime ||
            ""
        );
      }
    } catch (error) {
      console.error(
        "Fetch status error:",
        error
      );
    }
  };

  // =========================
  // UPDATE HOD STATUS
  // =========================

  const handleUpdateStatus =
    async (newStatus) => {
      setStatusError("");
      setStatusSuccess("");
      setStatusLoading(true);

      try {
        const token =
          sessionStorage.getItem(
            "hodToken"
          );

        const response =
          await fetch(
            `${API_URL}/api/status`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                status: newStatus,

                message:
                  hodStatusMessage,

                expectedReturnTime:
                  newStatus ===
                  "Unavailable"
                    ? hodExpectedReturn
                    : "",
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setStatusError(
            data.error ||
              "Unable to update status."
          );

          return;
        }

        setHodStatus(
          data.status
        );

        setHodStatusMessage("");



        setHodExpectedReturn(
          data.expectedReturnTime ||
            ""
        );

        setStatusSuccess(
          "Status updated successfully."
        );
      } catch (error) {
        console.error(
          "Update status error:",
          error
        );

        setStatusError(
          "Unable to connect to the server."
        );
      } finally {
        setStatusLoading(false);
      }
    };

  useEffect(() => {
    if (
      page ===
      "hod-dashboard"
    ) {
      fetchHodStatus();
    }
  }, [page]);
    // =========================
  // FACULTY LOGIN
  // =========================

  const handleFacultyLogin =
    async (e) => {
      e.preventDefault();

      setFacultyError("");

      if (
        !facultyId ||
        !facultyPassword
      ) {
        setFacultyError(
          "Please enter Faculty ID and password."
        );

        return;
      }

      setFacultyLoading(true);

      try {
        const response =
          await fetch(
            `${API_URL}/api/auth/faculty-login`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                facultyId:
                  facultyId
                    .trim()
                    .toUpperCase(),

                password:
                  facultyPassword,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          setFacultyError(
            data.error ||
              "Invalid Faculty ID or password."
          );

          return;
        }

        sessionStorage.setItem(
          "facultyToken",
          data.token
        );

        sessionStorage.setItem(
          "facultyUser",
          JSON.stringify(
            data.user
          )
        );

        setFacultyUser(
          data.user
        );

        setPage(
          "faculty-dashboard"
        );

        window.history.pushState(
          {},
          "",
          "/faculty"
        );
      } catch (error) {
        console.error(
          "Faculty login error:",
          error
        );

        setFacultyError(
          "Unable to connect to the server. Please check your internet connection."
        );
      } finally {
        setFacultyLoading(false);
      }
    };

  // =========================
  // FACULTY LOGOUT
  // =========================

  const handleFacultyLogout =
    () => {
      sessionStorage.removeItem(
        "facultyToken"
      );

      sessionStorage.removeItem(
        "facultyUser"
      );

      setFacultyUser(null);
      setFacultyId("");
      setFacultyPassword("");

      setPage("home");

      window.history.pushState(
        {},
        "",
        "/"
      );
    };
    // =========================
// FACULTY TIMETABLE APIs
// =========================

const fetchFacultyTimetable = async () => {
  setTimetableLoading(true);
  setTimetableError("");

  try {
    const token = sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/faculty/timetable`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setTimetableError(
        data.error || "Unable to load timetable."
      );
      return;
    }

    setFacultyTimetable(
      Array.isArray(data) ? data : []
    );
  } catch (error) {
    console.error(
      "Faculty timetable fetch error:",
      error
    );

    setTimetableError(
      "Unable to connect to the server."
    );
  } finally {
    setTimetableLoading(false);
  }
};
const fetchFacultyTasks = async () => {
  const token = sessionStorage.getItem("facultyToken");

  if (!token) return;

  try {
    setFacultyTasksLoading(true);
    setFacultyTasksError("");

    const response = await fetch(`${API_URL}/api/faculty/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to fetch tasks");
    }

    setFacultyTasks(data);
  } catch (error) {
    console.error("Faculty tasks error:", error);
    setFacultyTasksError(error.message || "Unable to load tasks.");
  } finally {
    setFacultyTasksLoading(false);
  }
};


// FACULTY TASK DATE & FREE PERIOD LOGIC

const getDayFromTaskDate = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue + "T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
};

const getFreeTaskPeriods = (dateValue, editingPeriod = null) => {
  const day = getDayFromTaskDate(dateValue);

  if (!day) {
    return [];
  }

  // Periods occupied by classes
  const occupiedClassPeriods = facultyTimetable
    .filter(
      (item) =>
        item.day_of_week === day &&
        Number(item.period_no) !== Number(editingPeriod)
    )
    .map((item) => Number(item.period_no));

  // Periods already used by tasks on the selected date
  const occupiedTaskPeriods = facultyTasks
    .filter(
      (task) =>
        task.task_date === dateValue &&
        Number(task.period_no) !== Number(editingPeriod)
    )
    .map((task) => Number(task.period_no));

  // Remove both class periods and already-used task periods
  const occupiedPeriods = [
    ...occupiedClassPeriods,
    ...occupiedTaskPeriods,
  ];

  return Object.keys(periodTimes)
    .map(Number)
    .filter(
      (periodNo) =>
        !occupiedPeriods.includes(periodNo)
    );
};

const saveFacultyTask = async () => {
  if (taskDateBlocked) {
    alert(
      facultyLeave
        ? "This date is marked as Leave. Task entry is disabled."
        : "This date is marked as Holiday. Task entry is disabled."
    );
    return;
  }
  const token = sessionStorage.getItem("facultyToken");

  if (!token) return;

  try {
    setFacultyTasksLoading(true);
    setFacultyTasksError("");
    setFacultyTasksSuccess("");

    const url = editingTaskId
      ? `${API_URL}/api/faculty/tasks/${editingTaskId}`
      : `${API_URL}/api/faculty/tasks`;

    const method = editingTaskId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        taskDate: taskForm.taskDate,
        dayOfWeek:
          getDayFromTaskDate(taskForm.taskDate),
        periodNo: Number(taskForm.periodNo),
        taskName: taskForm.taskName,
        taskDescription: taskForm.taskDescription,
        statusLevel: taskForm.statusLevel,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to save task");
    }

    setFacultyTasksSuccess(
      editingTaskId
        ? "Task updated successfully."
        : "Task added successfully."
    );

    setEditingTaskId(null);

    setTaskForm({
      taskDate: "",
      dayOfWeek: "",
      periodNo: "",
      taskName: "",
      taskDescription: "",
      statusLevel: "L1",
    });

    await fetchFacultyTasks();
  } catch (error) {
    console.error("Save faculty task error:", error);
    setFacultyTasksError(error.message || "Unable to save task.");
  } finally {
    setFacultyTasksLoading(false);
  }
};

const deleteFacultyTask = async (taskId) => {
  const token = sessionStorage.getItem("facultyToken");

  if (!token) return;

  try {
    setFacultyTasksLoading(true);
    setFacultyTasksError("");
    setFacultyTasksSuccess("");

    const response = await fetch(`${API_URL}/api/faculty/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to delete task");
    }

    setFacultyTasksSuccess("Task deleted successfully.");

    await fetchFacultyTasks();
  } catch (error) {
    console.error("Delete faculty task error:", error);
    setFacultyTasksError(error.message || "Unable to delete task.");
  } finally {
    setFacultyTasksLoading(false);
  }
};

const startEditingFacultyTask = (task) => {
  setEditingTaskId(task.id);

  setTaskForm({
    taskDate: task.task_date || "",
    dayOfWeek: task.day_of_week || "Monday",
    periodNo: String(task.period_no || 1),
    taskName: task.task_name || "",
    taskDescription: task.task_description || "",
    statusLevel: task.status_level || "L1",
  });

  setFacultyTasksError("");
  setFacultyTasksSuccess("");
};

const cancelEditingFacultyTask = () => {
  setEditingTaskId(null);

  setTaskForm({
    taskDate: "",
    dayOfWeek: "Monday",
    periodNo: "1",
    taskName: "",
    taskDescription: "",
    statusLevel: "L1",
  });

  setFacultyTasksError("");
  setFacultyTasksSuccess("");
};
// =====================================================
// FETCH FACULTY CURRENT STATUS
// =====================================================

const fetchFacultyCurrentStatus = async () => {
  try {
    setFacultyStatusLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    if (!token) {
      throw new Error(
        "Faculty session expired"
      );
    }

    const response = await fetch(
      `${API_URL}/api/faculty/current-status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to fetch current status"
      );
    }

    setFacultyCurrentStatus(data);

  } catch (error) {
    console.error(
      "Faculty current status error:",
      error
    );

    setFacultyCurrentStatus({
      status: "Unavailable",
    });

  } finally {
    setFacultyStatusLoading(false);
  }
};

// =====================================================
// FETCH FACULTY LEAVE / HOLIDAY FOR SELECTED DATE
// =====================================================

const fetchFacultyLeaveHoliday = async (date) => {
  if (!facultyUser || !date) {
    return;
  }

  try {
    setLeaveHolidayLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    const leaveResponse = await fetch(
      `${API_URL}/api/faculty/leave?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const leaveData =
      await leaveResponse.json();

    if (leaveResponse.ok) {
      setFacultyLeave(
        leaveData.leave || null
      );

      setFacultyLeaveReason(
        leaveData.leave?.reason || ""
      );
    }

    const holidayResponse = await fetch(
      `${API_URL}/api/holidays?date=${date}`
    );

    const holidayData =
      await holidayResponse.json();

    if (holidayResponse.ok) {
      setCollegeHoliday(
        holidayData.holiday || null
      );

      setHolidayName(
        holidayData.holiday?.holiday_name || ""
      );

      setHolidayDescription(
        holidayData.holiday?.description || ""
      );
    }

  } catch (error) {
    console.error(
      "Faculty leave/holiday fetch error:",
      error
    );
  } finally {
    setLeaveHolidayLoading(false);
  }
};


// =====================================================
// MARK FACULTY LEAVE
// =====================================================

const markFacultyLeave = async () => {
  if (!facultySelectedDate) {
    alert("Please select a date.");
    return;
  }

  try {
    setLeaveHolidayLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/faculty/leave`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          leaveDate: facultySelectedDate,
          reason: facultyLeaveReason || "",
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to mark leave"
      );
    }

    alert("Leave marked successfully.");

    await fetchFacultyLeaveHoliday(
      facultySelectedDate
    );

    await fetchFacultyCurrentStatus();

  } catch (error) {
    console.error(
      "Mark leave error:",
      error
    );

    alert(
      error.message ||
      "Unable to mark leave."
    );
  } finally {
    setLeaveHolidayLoading(false);
  }
};


// =====================================================
// CANCEL FACULTY LEAVE
// =====================================================

const cancelFacultyLeave = async () => {
  if (!facultySelectedDate) {
    return;
  }

  try {
    setLeaveHolidayLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/faculty/leave/${facultySelectedDate}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to cancel leave"
      );
    }

    alert(
      "Leave cancelled successfully."
    );

    setFacultyLeave(null);
    setFacultyLeaveReason("");

    await fetchFacultyCurrentStatus();

  } catch (error) {
    console.error(
      "Cancel leave error:",
      error
    );

    alert(
      error.message ||
      "Unable to cancel leave."
    );
  } finally {
    setLeaveHolidayLoading(false);
  }
};


// =====================================================
// MARK COLLEGE HOLIDAY
// =====================================================

const markCollegeHoliday = async () => {
  if (!facultySelectedDate) {
    alert("Please select a date.");
    return;
  }

  if (!holidayName.trim()) {
    alert("Please enter the holiday name.");
    return;
  }

  try {
    setLeaveHolidayLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/holidays`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          holidayDate: facultySelectedDate,
          holidayName: holidayName.trim(),
          description: holidayDescription.trim(),
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to mark holiday"
      );
    }

    alert(
      "College holiday marked successfully."
    );

    await fetchFacultyLeaveHoliday(
      facultySelectedDate
    );

    await fetchFacultyCurrentStatus();

  } catch (error) {
    console.error(
      "Mark holiday error:",
      error
    );

    alert(
      error.message ||
      "Unable to mark holiday."
    );
  } finally {
    setLeaveHolidayLoading(false);
  }
};


// =====================================================
// CANCEL COLLEGE HOLIDAY
// =====================================================

const cancelCollegeHoliday = async () => {
  if (!facultySelectedDate) {
    return;
  }

  try {
    setLeaveHolidayLoading(true);

    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/holidays/${facultySelectedDate}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        "Unable to cancel holiday"
      );
    }

    alert(
      "College holiday cancelled successfully."
    );

    setCollegeHoliday(null);
    setHolidayName("");
    setHolidayDescription("");

    await fetchFacultyCurrentStatus();

  } catch (error) {
    console.error(
      "Cancel holiday error:",
      error
    );

    alert(
      error.message ||
      "Unable to cancel holiday."
    );
  } finally {
    setLeaveHolidayLoading(false);
  }
};

const fetchFacultyHodAvailability = async () => {
  if (!facultyUser?.departmentId) {
    return;
  }

  try {
    setFacultyHodLoading(true);
    setFacultyHodError("");

    const response = await fetch(`${API_URL}/api/student/department/${facultyUser.departmentId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to fetch HOD availability");
    }

    setFacultyHodAvailability(data.hod || null);
  } catch (error) {
    console.error("Faculty HOD availability error:", error);
    setFacultyHodAvailability(null);
    setFacultyHodError(error.message || "Unable to load HOD availability.");
  } finally {
    setFacultyHodLoading(false);
  }
};

const resetTimetableForm = () => {
  setEditingPeriod(null);
  setOpenTimetableMenu(null);

  setTimetableForm({
    subject: "",
    className: "",
    section: "",
    room: "",
  });
};


const openTimetableForm = (periodNo) => {
  const existing = facultyTimetable.find(
    (item) =>
      item.day_of_week === timetableDay &&
      Number(item.period_no) === periodNo
  );

  setTimetableError("");
  setTimetableSuccess("");
  setEditingPeriod(periodNo);
  setOpenTimetableMenu(null);

  setTimetableForm({
    subject: existing?.subject || "",
    className: existing?.class_name || "",
    section: existing?.section || "",
    room: existing?.room || "",
  });
};


const handleTimetableSave = async (e) => {
  e.preventDefault();

  setTimetableError("");
  setTimetableSuccess("");

  if (!timetableForm.subject.trim()) {
    setTimetableError(
      "Please enter the subject."
    );
    return;
  }

  try {
    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/faculty/timetable`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          dayOfWeek: timetableDay,
          periodNo: editingPeriod,

          subject:
            timetableForm.subject,

          className:
            timetableForm.className,

          section:
            timetableForm.section,

          room:
            timetableForm.room,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setTimetableError(
        data.error ||
          "Unable to save timetable."
      );
      return;
    }

    setTimetableSuccess(
      "Class saved successfully."
    );

    resetTimetableForm();

    await fetchFacultyTimetable();

  } catch (error) {
    console.error(
      "Faculty timetable save error:",
      error
    );

    setTimetableError(
      "Unable to connect to the server."
    );
  }
};


const handleTimetableDelete = async (id) => {

  if (
    !window.confirm(
      "Delete this class from the timetable?"
    )
  ) {
    return;
  }

  setTimetableError("");
  setTimetableSuccess("");

  try {
    const token =
      sessionStorage.getItem("facultyToken");

    const response = await fetch(
      `${API_URL}/api/faculty/timetable/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setTimetableError(
        data.error ||
          "Unable to delete timetable entry."
      );
      return;
    }

    setTimetableSuccess(
      "Class deleted successfully."
    );

    resetTimetableForm();

    await fetchFacultyTimetable();

  } catch (error) {
    console.error(
      "Faculty timetable delete error:",
      error
    );

    setTimetableError(
      "Unable to connect to the server."
    );
  }
};



useEffect(() => {
  if (
    page === "faculty-dashboard" &&
    facultyUser
  ) {
    fetchFacultyTimetable();
    fetchFacultyCurrentStatus();
    fetchFacultyHodAvailability();
    fetchFacultyTasks();
    fetchFacultyLeaveHoliday(
      facultySelectedDate
    );
  }
}, [
  page,
  facultyUser,
  facultySelectedDate,
]);


// Automatically refresh current availability every 15 seconds
useEffect(() => {
  if (
    page !== "faculty-dashboard" ||
    !facultyUser
  ) {
    return;
  }

  const interval = setInterval(() => {
    fetchFacultyCurrentStatus();
  }, 15000);

  return () => {
    clearInterval(interval);
  };
}, [page, facultyUser]);


useEffect(() => {
  if (
    page !== "faculty-dashboard" ||
    !facultyUser
  ) {
    return;
  }

  const interval = setInterval(() => {
    fetchFacultyHodAvailability();
    fetchFacultyTasks();
  }, 15000);

  return () => {
    clearInterval(interval);
  };
}, [page, facultyUser]);


// =========================
// ADMIN
// =========================

const handleAdminLogin =
  (user) => {
    sessionStorage.setItem(
      "adminUser",
      JSON.stringify(user)
    );

    setPage(
      "admin-dashboard"
    );

    window.history.pushState(
      {},
      "",
      "/admin"
    );
  };

const handleAdminLogout =
  () => {
    sessionStorage.removeItem(
      "adminToken"
    );

    sessionStorage.removeItem(
      "adminUser"
    );

    setPage("home");

    window.history.pushState(
      {},
      "",
      "/"
    );
  };
  // ============================================================
  // HOME
  // ============================================================

  if (page === "home") {
    return (
      <>
        <style>
          {GLOBAL_STYLES +
            HOME_STYLES}
        </style>

        <div className="home-page">

          <header className="home-header">
  <div className="brand">
    <img
      src={facultyDeskLogo}
      alt="Faculty Desk"
      className="faculty-desk-logo"
    />
  </div>

  <div className="system-pill">
    Secure Academic Portal
  </div>
</header>

          <main className="home-content">

            <section className="hero">

              <div className="hero-badge">
                ✨ Welcome to the Campus Portal
              </div>

              <h1>
                Academic{" "}
                <span>
                  Availability
                </span>
                <br />
                Management
              </h1>

              <p>
                A unified platform for
                HODs, faculty members
                and administrators to
                manage academic
                availability and campus
                activities.
              </p>

            </section>

            <section className="login-grid">

              {/* HOD */}

              <div
                className="login-option"
                onClick={() => {
                  setPage(
                    "hod-login"
                  );

                  window.history.pushState(
                    {},
                    "",
                    "/"
                  );
                }}
              >

                <div className="option-icon">
                  👨‍💼
                </div>

                <div className="option-label">
                  Department
                </div>

                <div className="option-title">
                  HOD Portal
                </div>

                <div className="option-description">
                  Update HOD availability
                  and manage
                  department-level
                  information.
                </div>

                <button
                  className="option-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setPage(
                      "hod-login"
                    );
                  }}
                >
                  HOD Login →
                </button>

              </div>

              {/* FACULTY */}

              <div
                className="login-option faculty"
                onClick={() => {
                  setPage(
                    "faculty-login"
                  );

                  window.history.pushState(
                    {},
                    "",
                    "/faculty"
                  );
                }}
              >

                <div className="option-icon">
                  👨‍🏫
                </div>

                <div className="option-label">
                  Academic Staff
                </div>

                <div className="option-title">
                  Faculty Portal
                </div>

                <div className="option-description">
                  Manage your
                  availability,
                  timetable and
                  academic activities.
                </div>

                <button
                  className="option-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setPage(
                      "faculty-login"
                    );

                    window.history.pushState(
                      {},
                      "",
                      "/faculty"
                    );
                  }}
                >
                  Faculty Login →
                </button>

              </div>

              {/* ADMIN */}

              <div
                className="login-option admin"
                onClick={() => {
                  setPage(
                    "admin-login"
                  );

                  window.history.pushState(
                    {},
                    "",
                    "/admin"
                  );
                }}
              >

                <div className="option-icon">
                  🛡️
                </div>

                <div className="option-label">
                  System Management
                </div>

                <div className="option-title">
                  Admin Portal
                </div>

                <div className="option-description">
                  Manage departments,
                  HODs, faculty and
                  system configuration.
                </div>

                <button
                  className="option-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setPage(
                      "admin-login"
                    );

                    window.history.pushState(
                      {},
                      "",
                      "/admin"
                    );
                  }}
                >
                  Admin Login →
                </button>

              </div>

              {/* STUDENT */}

              <div
                className="login-option student"
                onClick={
                  openStudentPortal
                }
              >

                <div className="option-icon">
                  🎓
                </div>

                <div className="option-label">
                  Campus Access
                </div>

                <div className="option-title">
                  Student Portal
                </div>

                <div className="option-description">
                  Check HOD and faculty
                  availability by
                  selecting your
                  department.
                </div>

                <button
                  className="option-button"
                  onClick={(e) => {
                    e.stopPropagation();

                    openStudentPortal();
                  }}
                >
                  View Availability →
                </button>

              </div>

            </section>

          </main>

          <footer className="home-footer">

            <strong>
              Academic Availability System
            </strong>

            {" "}• Secure Campus Platform

          </footer>

        </div>
      </>
    );
  }

  // ============================================================
  // STUDENT PORTAL
  // ============================================================

  if (page === "student") {
    return (
      <>
        <style>{`

          ${GLOBAL_STYLES}

          .student-page {
            min-height: 100vh;

            background:
              radial-gradient(
                circle at 10% 10%,
                rgba(79,70,229,.15),
                transparent 30%
              ),

              radial-gradient(
                circle at 90% 15%,
                rgba(14,165,233,.14),
                transparent 28%
              ),

              linear-gradient(
                135deg,
                #f8fafc,
                #eef2ff,
                #eff6ff
              );

            padding-bottom: 50px;
          }

          .student-header {
            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 22px 6%;

            background:
              rgba(255,255,255,.72);

            border-bottom:
              1px solid
              rgba(148,163,184,.18);

            backdrop-filter: blur(12px);
          }

          .student-brand {
            display: flex;
            align-items: center;
            gap: 13px;
          }

          .student-logo {
            width: 48px;
            height: 48px;

            border-radius: 15px;

            display: flex;
            align-items: center;
            justify-content: center;

            background:
              linear-gradient(
                135deg,
                #4f46e5,
                #2563eb
              );

            color: white;

            font-size: 24px;

            box-shadow:
              0 10px 25px
              rgba(37,99,235,.20);
          }

          .student-brand-title {
            color: #172554;
            font-size: 18px;
            font-weight: 800;
          }

          .student-brand-subtitle {
            color: #64748b;
            font-size: 11px;
            margin-top: 3px;
          }

          .student-back {
            border:
              1px solid #dbe3ed;

            background: white;

            color: #475569;

            border-radius: 11px;

            padding: 10px 15px;

            font-weight: 700;

            cursor: pointer;
          }

          .student-content {
            width: 100%;
            max-width: 1050px;

            margin: auto;

            padding: 45px 22px;
          }

          .student-hero {
            text-align: center;
            margin-bottom: 30px;
          }

          .student-badge {
            display: inline-block;

            padding: 8px 14px;

            border-radius: 999px;

            background: #eef2ff;

            color: #4f46e5;

            font-size: 11px;

            font-weight: 800;

            margin-bottom: 14px;
          }

          .student-hero h1 {
            margin: 0;

            color: #172554;

            font-size:
              clamp(
                30px,
                5vw,
                48px
              );
          }

          .student-hero p {
            color: #64748b;

            max-width: 650px;

            margin:
              12px auto 0;

            line-height: 1.6;

            font-size: 14px;
          }

          .student-selector {
            max-width: 650px;

            margin:
              0 auto 30px;

            background:
              rgba(255,255,255,.94);

            padding: 24px;

            border-radius: 20px;

            border:
              1px solid
              rgba(148,163,184,.18);

            box-shadow:
              0 18px 45px
              rgba(15,23,42,.07);
          }

          .student-selector label {
            display: block;

            color: #334155;

            font-size: 12px;

            font-weight: 800;

            margin-bottom: 8px;
          }

          .student-select {
            width: 100%;

            height: 50px;

            padding: 0 14px;

            border-radius: 12px;

            border:
              1px solid #dbe3ed;

            background: #f8fafc;

            color: #0f172a;

            font-size: 14px;

            outline: none;
          }

          .student-select:focus {
            border-color: #6366f1;

            background: white;

            box-shadow:
              0 0 0 4px
              rgba(99,102,241,.10);
          }

          .student-loading {
            text-align: center;

            color: #64748b;

            padding: 25px;
          }

          .student-error {
            max-width: 650px;

            margin:
              15px auto;

            padding:
              12px 15px;

            border-radius: 12px;

            background: #fef2f2;

            border:
              1px solid #fecaca;

            color: #b91c1c;

            font-size: 13px;

            font-weight: 600;
          }

          .student-department-title {
            text-align: center;

            margin:
              25px 0;
          }

          .student-department-title h2 {
            margin: 0;

            color: #172554;

            font-size: 25px;
          }

          .student-department-title p {
            color: #64748b;

            margin-top: 6px;

            font-size: 13px;
          }

          .student-grid {
            display: grid;

            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );

            gap: 20px;
          }

          .student-card {
            background:
              rgba(255,255,255,.95);

            border-radius: 20px;

            border:
              1px solid
              rgba(148,163,184,.18);

            padding: 24px;

            box-shadow:
              0 18px 45px
              rgba(15,23,42,.07);
          }

          .student-card-header {
            display: flex;

            align-items: center;

            justify-content:
              space-between;

            gap: 10px;

            margin-bottom: 18px;
          }

          .student-card-title {
            color: #172554;

            font-size: 19px;

            font-weight: 800;
          }

          .student-card-icon {
            width: 42px;
            height: 42px;

            border-radius: 13px;

            display: flex;
            align-items: center;
            justify-content: center;

            background: #eef2ff;

            font-size: 20px;
          }

          .student-person {
            padding: 17px;

            border-radius: 15px;

            background: #f8fafc;

            border:
              1px solid #eef2f7;
          }

          .student-person-name {
            color: #0f172a;

            font-weight: 800;

            font-size: 16px;
          }

          .student-person-id {
            color: #64748b;

            font-size: 11px;

            margin-top: 4px;
          }

          .student-status {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 11px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 800;
            margin-top: 12px;
          }

          .student-status.available {
            background: #dcfce7;
            color: #15803d;
          }

          .student-status.unavailable {
            background: #fee2e2;
            color: #b91c1c;
          }

          .student-status.not-configured {
            background: #dc2626;
            color: white;
            border: 1px solid #b91c1c;
          }

          .student-info {
            margin-top: 10px;

            color: #64748b;

            font-size: 12px;

            line-height: 1.6;
          }

          .student-refresh {
            display: block;

            margin:
              25px auto 0;

            border: none;

            border-radius: 12px;

            padding:
              12px 20px;

            background:
              linear-gradient(
                135deg,
                #4f46e5,
                #2563eb
              );

            color: white;

            font-weight: 800;

            cursor: pointer;
          }

          .student-faculty-list {
            display: flex;

            flex-direction: column;

            gap: 12px;
          }

          .student-empty {
            padding: 20px;

            text-align: center;

            color: #64748b;

            background: #f8fafc;

            border-radius: 14px;

            font-size: 13px;
          }

          @media (max-width: 750px) {

            .student-grid {
              grid-template-columns:
                1fr;
            }

            .student-header {
              padding:
                18px 20px;
            }

            .student-content {
              padding-top: 30px;
            }
          }

          @media (max-width: 480px) {

            .student-brand-title {
              font-size: 15px;
            }

            .student-brand-subtitle {
              display: none;
            }

            .student-back {
              padding:
                8px 11px;

              font-size: 11px;
            }

            .student-selector,
            .student-card {
              padding: 18px;
            }
          }

        `}</style>

        <div className="student-page">

          <header className="student-header">

            <div className="student-brand">

              <div className="student-logo">
                🎓
              </div>

              <div>

                <div className="student-brand-title">
                  Academic Availability System
                </div>

                <div className="student-brand-subtitle">
                  Student Portal
                </div>

              </div>

            </div>

            <button
              className="student-back"
              onClick={() => {

                setPage("home");

                setStudentDepartment(
                  ""
                );

                setStudentData(
                  null
                );

                setStudentError(
                  ""
                );

                window.history.pushState(
                  {},
                  "",
                  "/"
                );
              }}
            >
              ← Home
            </button>

          </header>

          <main className="student-content">

            <section className="student-hero">

              <div className="student-badge">
                🔎 CHECK AVAILABILITY
              </div>

              <h1>
                Faculty & HOD Availability
              </h1>

              <p>
                Select your department to view
                the current availability of the
                HOD and faculty members.
              </p>

            </section>

            <div className="student-selector">

              <label>
                SELECT DEPARTMENT
              </label>

              <select
                className="student-select"
                value={
                  studentDepartment
                }
                onChange={
                  handleStudentDepartmentChange
                }
              >

                <option value="">
                  Select your department
                </option>

                {studentDepartments.map(
                  (department) => (
                    <option
                      key={
                        department.id
                      }
                      value={
                        department.id
                      }
                    >
                      {department.code}
                      {" — "}
                      {department.name}
                    </option>
                  )
                )}

              </select>

            </div>

            {studentError && (
              <div className="student-error">
                ⚠ {studentError}
              </div>
            )}

            {studentLoading && (
              <div className="student-loading">
                Loading availability...
              </div>
            )}

            {studentData &&
              !studentLoading && (
                <>
                  <div className="student-department-title">

                    <h2>
                      {
                        studentData
                          .department
                          .name
                      }
                    </h2>

                    <p>
                      Department Code:{" "}
                      {
                        studentData
                          .department
                          .code
                      }
                    </p>

                  </div>

                  <div className="student-grid">

                    {/* HOD CARD */}

                    <div className="student-card">

                      <div className="student-card-header">

                        <div className="student-card-title">
                          HOD Availability
                        </div>

                        <div className="student-card-icon">
                          👨‍💼
                        </div>

                      </div>

                      {studentData.hod ? (

                        <div className="student-person">

                          <div className="student-person-name">
                            {
                              studentData
                                .hod
                                .name
                            }
                          </div>

                          <div className="student-person-id">
                            HOD ID:{" "}
                            {
                              studentData
                                .hod
                                .hodId
                            }
                          </div>

                          <div
                            className={
                              `student-status ${
                                studentData.hod.status ===
                                "Available"
                                  ? "available"
                                  : studentData.hod.status ===
                                    "In Meeting"
                                  ? "meeting"
                                  : studentData.hod.status ===
                                    "Away"
                                  ? "away"
                                  : studentData.hod.status ===
                                    "Unavailable"
                                  ? "unavailable"
                                  : "default"
                              }`
                            }
                          >

                            {
                              studentData
                                .hod
                                .status ===
                              "Available"
                                ? "🟢"
                                : studentData
                                    .hod
                                    .status ===
                                  "In Meeting"
                                ? "🟡"
                                : studentData
                                    .hod
                                    .status ===
                                  "Away"
                                ? "🔵"
                                : "🔴"
                            }

                            {
                              studentData
                                .hod
                                .status
                            }

                          </div>

                          {
                            studentData
                              .hod
                              .message && (
                              <div className="student-info">

                                <strong>
                                  Message:
                                </strong>{" "}

                                {
                                  studentData
                                    .hod
                                    .message
                                }

                              </div>
                            )
                          }

                          {
                            studentData
                              .hod
                              .expectedReturnTime && (
                              <div className="student-info">

                                <strong>
                                  Expected Return:
                                </strong>{" "}

                                {
                                  studentData
                                    .hod
                                    .expectedReturnTime
                                }

                              </div>
                            )
                          }

                        </div>

                      ) : (

                        <div className="student-empty">
                          HOD information is not
                          available.
                        </div>

                      )}

                    </div>

                    {/* FACULTY CARD */}

                    <div className="student-card">

                      <div className="student-card-header">

                        <div className="student-card-title">
                          Faculty Availability
                        </div>

                        <div className="student-card-icon">
                          👨‍🏫
                        </div>

                      </div>

                      <div className="student-faculty-list">

                        {studentData.faculty &&
                        studentData.faculty.length >
                          0 ? (

                          studentData.faculty.map(
                            (faculty) => (
                              <div
                                className="student-person"
                                key={faculty.id}
                              >

                                <div className="student-person-name">
                                  {faculty.name}
                                </div>

                                <div
                                  className={`student-status ${
                                    faculty.status === "Available"
                                      ? "available"
                                      : faculty.status === "Not Configured"
                                      ? "not-configured"
                                      : "unavailable"
                                  }`}
                                >
                                  {faculty.status === "Available"
                                    ? "🟢"
                                    : faculty.status === "Not Configured"
                                    ? "⚪"
                                    : "🔴"}

                                  {faculty.status}
                                </div>

                                {faculty.message && (
                                  <div className="student-info">
                                    <strong>Message:</strong>{" "}
                                    {faculty.message}
                                  </div>
                                )}

                                {faculty.expectedReturnTime && (
                                  <div className="student-info">
                                    <strong>Expected Return:</strong>{" "}
                                    {faculty.expectedReturnTime}
                                  </div>
                                )}

                                {faculty.periodNo && (
                                  <div className="student-info">
                                    <strong>Period:</strong>{" "}
                                    P{faculty.periodNo}
                                  </div>
                                )}

                                {faculty.subject && (
                                  <div className="student-info">
                                    <strong>Subject:</strong>{" "}
                                    {faculty.subject}
                                  </div>
                                )}

                                {faculty.className && (
                                  <div className="student-info">
                                    <strong>Class:</strong>{" "}
                                    {faculty.className}
                                  </div>
                                )}

                                {faculty.section && (
                                  <div className="student-info">
                                    <strong>Section:</strong>{" "}
                                    {faculty.section}
                                  </div>
                                )}

                                {faculty.room && (
                                  <div className="student-info">
                                    <strong>Room:</strong>{" "}
                                    {faculty.room}
                                  </div>
                                )}

                              </div>
                            )
                          )

                        ) : (

                          <div className="student-empty">
                            No active faculty found
                            for this department.
                          </div>

                        )}

                      </div>

                    </div>

                  </div>

                  <button
                    className="student-refresh"
                    onClick={
                      handleStudentRefresh
                    }
                    disabled={
                      studentLoading
                    }
                  >
                    🔄 Refresh Availability
                  </button>

                </>
              )}

          </main>

        </div>
      </>
    );
  }

  // ============================================================
  // HOD LOGIN
  // ============================================================

  if (page === "hod-login") {
        return (
      <>
        <style>
          {GLOBAL_STYLES +
            COMMON_LOGIN_STYLES}
        </style>

        <div className="login-page">

          <div className="login-card">

            <h1>
              HOD Login
            </h1>

            <p className="login-subtitle">
              Sign in to manage HOD availability.
            </p>

            <form
              onSubmit={
                handleHodLogin
              }
            >

              <label>
                HOD ID
              </label>

              <input
                type="text"
                placeholder="Enter HOD ID"
                value={hodId}
                onChange={(e) =>
                  setHodId(
                    e.target.value
                  )
                }
                autoComplete="username"
              />

              <label>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={hodPassword}
                onChange={(e) =>
                  setHodPassword(
                    e.target.value
                  )
                }
                autoComplete="current-password"
              />

              {hodError && (
                <div className="login-error">
                  ⚠ {hodError}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  hodLoading
                }
              >
                {hodLoading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>

            <button
              style={{
                background:
                  "#64748b",
              }}
              onClick={() => {
                setPage(
                  "home"
                );

                window.history.pushState(
                  {},
                  "",
                  "/"
                );
              }}
            >
              ← Back
            </button>

          </div>

        </div>
      </>
    );
  }

  // ============================================================
  // FACULTY LOGIN
  // ============================================================

  if (
    page ===
    "faculty-login"
  ) {

    return (
     <>
  <style>
    {
      GLOBAL_STYLES +
      FACULTY_STYLES +
      COMMON_LOGIN_STYLES
    }
  </style>

  <div className="faculty-login-page">

          <div className="faculty-bg-circle faculty-circle-one" />

          <div className="faculty-bg-circle faculty-circle-two" />

          <div className="faculty-login-wrapper">

            <div className="faculty-brand-panel">

              <div className="faculty-brand-content">

                <div className="faculty-brand-icon">
                  👨‍🏫
                </div>

                <h2>
                  Faculty
                  <br />
                  Academic Portal
                </h2>

                <p>
                  Manage your academic
                  availability, timetable
                  and faculty activities
                  from one secure platform.
                </p>

              </div>

              <div className="faculty-feature-list">

                <div className="faculty-feature">

                  <div className="faculty-feature-check">
                    ✓
                  </div>

                  Availability Management

                </div>

                <div className="faculty-feature">

                  <div className="faculty-feature-check">
                    ✓
                  </div>

                  Timetable Management

                </div>

                <div className="faculty-feature">

                  <div className="faculty-feature-check">
                    ✓
                  </div>

                  Academic Activities

                </div>

              </div>

            </div>

            <div className="faculty-form-panel">

              <div className="faculty-form-top">

                <div className="faculty-welcome">
                  Welcome Back
                </div>

                <h1>
                  Faculty Login
                </h1>

                <p className="faculty-form-subtitle">
                  Sign in to access your faculty dashboard.
                </p>

              </div>

              <form
                onSubmit={
                  handleFacultyLogin
                }
              >

                <div className="faculty-field">

                  <label>
                    FACULTY ID
                  </label>

                  <div className="faculty-input-wrapper">

                    <span className="faculty-input-icon">
                      👤
                    </span>

                    <input
                      className="faculty-input"
                      type="text"
                      placeholder="Enter your Faculty ID"
                      value={
                        facultyId
                      }
                      onChange={(e) =>
                        setFacultyId(
                          e.target.value
                        )
                      }
                      autoComplete="username"
                    />

                  </div>

                </div>

                <div className="faculty-field">

                  <label>
                    PASSWORD
                  </label>

                  <div className="faculty-input-wrapper">

                    <span className="faculty-input-icon">
                      🔒
                    </span>

                    <input
                      className="faculty-input"
                      type="password"
                      placeholder="Enter your password"
                      value={
                        facultyPassword
                      }
                      onChange={(e) =>
                        setFacultyPassword(
                          e.target.value
                        )
                      }
                      autoComplete="current-password"
                    />

                  </div>

                </div>

                {facultyError && (
                  <div className="faculty-login-error">
                    ⚠ {facultyError}
                  </div>
                )}

                <button
                  className="faculty-login-button"
                  type="submit"
                  disabled={
                    facultyLoading
                  }
                >
                  {facultyLoading
                    ? "Signing in..."
                    : "Sign In to Faculty Portal →"}
                </button>

              </form>

              <button
                className="faculty-back-button"
                onClick={() => {

                  setPage(
                    "home"
                  );

                  window.history.pushState(
                    {},
                    "",
                    "/"
                  );

                }}
              >
                ← Back to Login Selection
              </button>

              <div className="faculty-security-note">
                🔐 Secure Faculty Access
              </div>

            </div>

          </div>

        </div>
      </>
    );
  }

  // ============================================================
  // ADMIN LOGIN
  // ============================================================

  if (
    page ===
    "admin-login"
  ) {

    return (
      <AdminLogin
        onLogin={
          handleAdminLogin
        }
      />
    );
  }

  // ============================================================
  // HOD DASHBOARD
  // ============================================================

  if (
    page ===
    "hod-dashboard"
  ) {

    return (
      <>
        <style>
          {
            GLOBAL_STYLES +
            COMMON_LOGIN_STYLES
          }
        </style>

        <div className="login-page">

          <div className="login-card">

            <h1>
              HOD Dashboard
            </h1>

            <p className="login-subtitle">
              Welcome,{" "}
              {hodUser?.name ||
                "HOD"}
            </p>

            <p>
              <strong>
                Current Status:
              </strong>{" "}

              {hodStatus ===
              "Available"
                ? "🟢 Available"
                : hodStatus ===
                  "Unavailable"
                ? "🔴 Unavailable"
                : "Loading..."}
            </p>

            <label>
              Status Message
            </label>

            <input
              type="text"
              placeholder="e.g. In a meeting"
              value={
                hodStatusMessage
              }
              onChange={(e) =>
                setHodStatusMessage(
                  e.target.value
                )
              }
            />

            {hodStatus ===
              "Unavailable" && (
              <>
                <label>
                  Expected Return
                </label>

                <input
                  type="text"
                  placeholder="e.g. 3:00 PM"
                  value={
                    hodExpectedReturn
                  }
                  onChange={(e) =>
                    setHodExpectedReturn(
                      e.target.value
                    )
                  }
                />
              </>
            )}

            {statusError && (
              <div className="login-error">
                {statusError}
              </div>
            )}

            {statusSuccess && (
              <div
                style={{
                  color:
                    "#15803d",

                  background:
                    "#f0fdf4",

                  padding:
                    "10px",

                  borderRadius:
                    "10px",

                  marginTop:
                    "12px",
                }}
              >
                {
                  statusSuccess
                }
              </div>
            )}

            <button
              onClick={() =>
                handleUpdateStatus(
                  "Available"
                )
              }
              disabled={
                statusLoading
              }
            >
              🟢 Mark as Available
            </button>

            <button
              onClick={() =>
                handleUpdateStatus(
                  "Unavailable"
                )
              }
              disabled={
                statusLoading
              }
            >
              🔴 Mark as Unavailable
            </button>

            <button
              onClick={
                handleHodLogout
              }
              style={{
                background:
                  "#64748b",
              }}
            >
              Logout
            </button>

          </div>

        </div>
      </>
    );
  }

// ============================================================
// FACULTY DASHBOARD
// ============================================================

if (
  page ===
  "faculty-dashboard"
) {

  const todayName = new Intl.DateTimeFormat(
    "en-IN",
    { timeZone: "Asia/Kolkata", weekday: "long" }
  ).format(new Date());

  const todayEntries = facultyTimetable.filter(
    (item) => item.day_of_week === todayName
  );

  const dayEntries = facultyTimetable.filter(
    (item) => item.day_of_week === timetableDay
  );

  const getEntryForPeriod = (periodNo) =>
    dayEntries.find(
      (item) => Number(item.period_no) === periodNo
    );

  const pendingTasks = facultyTasks.filter(
    (task) => task.status_level !== "L3"
  ).length;

  const availabilityStatus =
    facultyCurrentStatus?.status || "Loading...";

  const availabilityLabel =
    availabilityStatus === "Leave"
      ? "ON LEAVE"
      : availabilityStatus === "Holiday"
      ? "HOLIDAY"
      : availabilityStatus === "In Class"
      ? "IN CLASS"
      : availabilityStatus === "Available"
      ? "AVAILABLE"
      : availabilityStatus === "Unavailable"
      ? "NOT AVAILABLE"
      : availabilityStatus.toUpperCase();

  const availabilitySub =
    availabilityStatus === "Leave"
      ? "Personal leave"
      : availabilityStatus === "Holiday"
      ? facultyCurrentStatus?.holidayName || "College holiday"
      : availabilityStatus === "In Class"
      ? facultyCurrentStatus?.subject || "Currently in class"
      : availabilityStatus === "Available"
      ? "Free to assist"
      : availabilityStatus === "Unavailable"
      ? "College closed / unavailable"
      : "Checking status...";

  const facultySectionMeta = {
    dashboard: {
      title: "Dashboard",
      subtitle: "Your daily academic overview and quick access."
    },
    timetable: {
      title: "My Timetable",
      subtitle: "Manage your Monday–Saturday teaching schedule."
    },
    leave: {
      title: "Leave & Holiday",
      subtitle: "Manage faculty leave and college holiday dates."
    },
    tasks: {
      title: "Task Management",
      subtitle: "Record and track work completed during free periods."
    },
    reports: {
      title: "Faculty Reports",
      subtitle: "Generate and review your P1–P8 daily activity reports."
    },
  };

  const activeMeta = facultySectionMeta[facultySection] || facultySectionMeta.dashboard;

  const navigateFacultySection = (section) => {
    setFacultySection(section);
    setFacultySidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  const timetablePeriodCards = Array.from({ length: 8 }, (_, index) => index + 1).map(
    (periodNo) => {
      const entry = getEntryForPeriod(periodNo);
      const [startTime, endTime] = periodTimes[periodNo];
      const isEditing = editingPeriod === periodNo;

      return (
        <div
          key={periodNo}
          className={`fd-period-card ${entry ? "has-class" : "free"}`}
        >
          <div className="fd-period-top">
            <strong>P{periodNo}</strong>
            <span className="fd-period-time">
              {startTime} – {endTime}
            </span>
          </div>

          <div className="fd-period-content">
            {entry ? (
              <>
                <div className="fd-class-subject">
                  {entry.subject || "Class"}
                </div>
                <div className="fd-class-meta">
                  {entry.class_name || "Class"}
                  {entry.section ? ` - ${entry.section}` : ""}
                </div>
                {entry.room && (
                  <div className="fd-class-room">
                    Room {entry.room}
                  </div>
                )}
              </>
            ) : (
              <div className="fd-free-period">
                <span className="fd-free-dot" />
                <span>Free Period</span>
              </div>
            )}
          </div>

          <div className="fd-period-actions">
            <div
              className="fd-period-menu-wrap"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="fd-period-menu-button"
                aria-label={`Actions for P${periodNo}`}
                onClick={() =>
                  setOpenTimetableMenu(
                    openTimetableMenu === periodNo ? null : periodNo
                  )
                }
              >
                ⋮
              </button>

              {openTimetableMenu === periodNo && (
                <div className="fd-period-menu">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenTimetableMenu(null);
                      openTimetableForm(periodNo);
                    }}
                  >
                    {entry ? "✎ Edit Class" : "+ Add Class"}
                  </button>

                  {entry && (
                    <button
                      type="button"
                      className="fd-period-menu-delete"
                      onClick={() => {
                        setOpenTimetableMenu(null);
                        handleTimetableDelete(entry.id);
                      }}
                    >
                      🗑 Delete Class
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <form
              onSubmit={handleTimetableSave}
              style={{
                marginTop: "14px",
                padding: "16px",
                borderRadius: "12px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                  gap: "12px",
                }}
              >
                <label style={{ color: "#334155", fontWeight: 700, fontSize: "13px" }}>
                  Subject
                  <input
                    value={timetableForm.subject}
                    onChange={(e) =>
                      setTimetableForm({
                        ...timetableForm,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Data Wrangling & EDA"
                    style={{ marginTop: "6px", width: "100%", padding: "11px", border: "1px solid #cbd5e1", borderRadius: "9px" }}
                  />
                </label>

                <label style={{ color: "#334155", fontWeight: 700, fontSize: "13px" }}>
                  Class
                  <input
                    value={timetableForm.className}
                    onChange={(e) =>
                      setTimetableForm({
                        ...timetableForm,
                        className: e.target.value,
                      })
                    }
                    placeholder="III B.Tech"
                    style={{ marginTop: "6px", width: "100%", padding: "11px", border: "1px solid #cbd5e1", borderRadius: "9px" }}
                  />
                </label>

                <label style={{ color: "#334155", fontWeight: 700, fontSize: "13px" }}>
                  Section
                  <input
                    value={timetableForm.section}
                    onChange={(e) =>
                      setTimetableForm({
                        ...timetableForm,
                        section: e.target.value,
                      })
                    }
                    placeholder="A"
                    style={{ marginTop: "6px", width: "100%", padding: "11px", border: "1px solid #cbd5e1", borderRadius: "9px" }}
                  />
                </label>

                <label style={{ color: "#334155", fontWeight: 700, fontSize: "13px" }}>
                  Room
                  <input
                    value={timetableForm.room}
                    onChange={(e) =>
                      setTimetableForm({
                        ...timetableForm,
                        room: e.target.value,
                      })
                    }
                    placeholder="302"
                    style={{ marginTop: "6px", width: "100%", padding: "11px", border: "1px solid #cbd5e1", borderRadius: "9px" }}
                  />
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button type="submit" style={{ width: "auto", marginTop: 0, padding: "10px 18px" }}>
                  Save Class
                </button>
                <button
                  type="button"
                  onClick={resetTimetableForm}
                  style={{ width: "auto", marginTop: 0, padding: "10px 18px", background: "#64748b" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      );
    }
  );
  const navButton = (section, icon, label) => (
    <button
      type="button"
      className={`fd-sidebar-btn ${facultySection === section ? "active" : ""}`}
      onClick={() => navigateFacultySection(section)}
    >
      <span className="fd-sidebar-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <style>
        {
          GLOBAL_STYLES +
          COMMON_LOGIN_STYLES +
          FACULTY_DASHBOARD_STYLES +
          FACULTY_DASHBOARD_PRO_STYLES +
          FACULTY_DESIGN_STYLES
        }
      </style>

      <div className="fd-dashboard-root fd-professional-root">

        {facultySidebarOpen && (
          <div
            className="fd-sidebar-overlay"
            onClick={() => setFacultySidebarOpen(false)}
          />
        )}

        <aside className={`fd-sidebar ${facultySidebarOpen ? "mobile-open" : ""}`}>
          <div className="fd-sidebar-brand">
            <img
              src={facultyDeskLogo}
              alt="Faculty Desk"
            />
          </div>

          <div className="fd-sidebar-label">Main Menu</div>

          <nav className="fd-sidebar-nav">
            {navButton("dashboard", "⌂", "Dashboard")}
            {navButton("timetable", "▣", "My Timetable")}
            {navButton("leave", "◫", "Leave & Holiday")}
            {navButton("tasks", "✓", "Task Management")}
            {navButton("reports", "▥", "Reports")}
          </nav>

          <div className="fd-sidebar-spacer" />

          <div className="fd-sidebar-support">
            <div className="fd-sidebar-label">Support</div>

            <button
              type="button"
              className="fd-sidebar-btn"
              onClick={() => alert("Profile management will be available here.")}
            >
              <span className="fd-sidebar-icon">●</span>
              <span>Profile</span>
            </button>

            <button
              type="button"
              className="fd-sidebar-btn"
              onClick={() => alert("Faculty Desk settings will be available here.")}
            >
              <span className="fd-sidebar-icon">⚙</span>
              <span>Settings</span>
            </button>

            <button
              type="button"
              className="fd-sidebar-btn"
              onClick={() => alert("Faculty Desk Help")}
            >
              <span className="fd-sidebar-icon">?</span>
              <span>Help</span>
            </button>
          </div>

          <button
            type="button"
            className="fd-sidebar-logout"
            onClick={handleFacultyLogout}
          >
            ↪ &nbsp; Logout
          </button>
        </aside>

        <div className="fd-content">
          <header className="fd-topbar">
            <div className="fd-topbar-left">
              <button
                type="button"
                className="fd-menu"
                onClick={() => setFacultySidebarOpen(true)}
                aria-label="Open menu"
              >
                ☰
              </button>

              <div className="fd-page-heading">
                <div className="fd-page-heading-title">{activeMeta.title}</div>
                <div className="fd-page-heading-subtitle">Faculty Desk</div>
              </div>
            </div>

            <div className="fd-profile">
              <span className="fd-notification" aria-label="Notifications">♧</span>

              <div className="fd-avatar">
                {(facultyUser?.name || "F")
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <div className="fd-profile-name">
                  {facultyUser?.name || "Faculty"}
                </div>
                <div className="fd-profile-role">
                  Faculty ({facultyUser?.department?.code || facultyUser?.departmentCode || ""})
                </div>
              </div>
            </div>
          </header>

          <main className="fd-main fd-professional-main">

            <div className="fd-page-intro">
              <div>
                <div className="fd-eyebrow">Faculty Portal</div>
                <h1>{activeMeta.title}</h1>
                <p>{activeMeta.subtitle}</p>
              </div>

              <div className="fd-date-card">
                <div className="fd-date-icon">▣</div>
                <div>
                  <div className="fd-date-main">
                    {new Intl.DateTimeFormat("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      weekday: "long",
                    }).format(new Date())}
                  </div>
                  <div className="fd-date-sub">Academic Year 2026 – 27</div>
                </div>
              </div>
            </div>

            {facultySection === "dashboard" && (
              <>
                <div className="fd-overview fd-professional-overview">
                  <div className={`fd-overview-card fd-status-${availabilityStatus === "Available" ? "green" : availabilityStatus === "In Class" ? "blue" : availabilityStatus === "Leave" ? "purple" : availabilityStatus === "Holiday" ? "orange" : "red"}`}>
                    <div className="fd-overview-icon">●</div>
                    <div>
                      <div className="fd-overview-label">My Current Availability</div>
                      <div className="fd-overview-value">{availabilityLabel}</div>
                      <div className="fd-overview-sub">{availabilitySub}</div>
                    </div>
                  </div>

                  <div className="fd-overview-card fd-status-blue">
                    <div className="fd-overview-icon">▣</div>
                    <div>
                      <div className="fd-overview-label">Today’s Classes</div>
                      <div className="fd-overview-value">{todayEntries.length}</div>
                      <div className="fd-overview-sub">Scheduled classes</div>
                    </div>
                  </div>

                  <div className="fd-overview-card fd-status-purple">
                    <div className="fd-overview-icon">✓</div>
                    <div>
                      <div className="fd-overview-label">Pending Tasks</div>
                      <div className="fd-overview-value">{pendingTasks}</div>
                      <div className="fd-overview-sub">Yet to complete</div>
                    </div>
                  </div>

                  <div className="fd-overview-card fd-status-orange">
                    <div className="fd-overview-icon">●</div>
                    <div>
                      <div className="fd-overview-label">HOD Availability</div>
                      <div className="fd-overview-value">{facultyHodAvailability?.status || "Unavailable"}</div>
                      <div className="fd-overview-sub">{facultyHodAvailability?.message || "Department HOD"}</div>
                    </div>
                  </div>
                </div>

                <div className="fd-dashboard-grid fd-dashboard-grid-single">
                  <section className="fd-section-card fd-welcome-card">
                    <div className="fd-section-title">
                      <div>
                        <span className="fd-card-kicker">TODAY</span>
                        <h2>Welcome back, {facultyUser?.name || "Faculty"} 👋</h2>
                      </div>
                    </div>
                    <p className="fd-card-description">
                      Here’s your overview for today. Use the menu to manage your timetable, leave, tasks and reports separately.
                    </p>

                    <div className="fd-dashboard-actions">
                      <button type="button" className="fd-primary-action" onClick={() => navigateFacultySection("timetable")}>
                        <span>▣</span> View Timetable
                      </button>
                      <button type="button" className="fd-secondary-action" onClick={() => navigateFacultySection("tasks")}>
                        <span>✓</span> Manage Tasks
                      </button>
                      <button type="button" className="fd-secondary-action" onClick={() => navigateFacultySection("reports")}>
                        <span>▥</span> View Reports
                      </button>
                    </div>
                  </section>
                </div>

                <section className="fd-section-card fd-quick-section">
                  <div className="fd-section-title">
                    <div>
                      <span className="fd-card-kicker">SHORTCUTS</span>
                      <h2>Quick Actions</h2>
                    </div>
                  </div>
                  <div className="fd-quick-grid">
                    <button className="fd-quick" type="button" onClick={() => navigateFacultySection("leave")}>
                      <strong>▣ Mark Leave</strong>
                      <span>Apply or manage faculty leave</span>
                    </button>
                    <button className="fd-quick" type="button" onClick={() => navigateFacultySection("leave")}>
                      <strong>☂ Mark Holiday</strong>
                      <span>Manage college holiday dates</span>
                    </button>
                    <button className="fd-quick" type="button" onClick={() => navigateFacultySection("reports")}>
                      <strong>▥ Generate Report</strong>
                      <span>View P1–P8 activity reports</span>
                    </button>
                    <button className="fd-quick" type="button" onClick={() => alert("Profile management will be available here.")}>
                      <strong>● My Profile</strong>
                      <span>Manage your faculty profile</span>
                    </button>
                  </div>
                </section>
              </>
            )}

            {facultySection === "timetable" && (
              <section className="fd-page-section">
                <div id="faculty-timetable-section">
          {/* TIMETABLE */}

          <div
            style={{
              marginTop:
                "24px",
              padding:
                "20px",
              borderRadius:
                "16px",
              background:
                "linear-gradient(135deg,#eff6ff,#f8fafc)",
              border:
                "1px solid #dbeafe",
            }}
          >

            <h2
              style={{
                margin:
                  "0 0 6px",
                color:
                  "#172554",
                fontSize:
                  "22px",
              }}
            >
              My Timetable
            </h2>


            <p
              style={{
                margin:
                  "0 0 16px",
                color:
                  "#64748b",
                fontSize:
                  "14px",
              }}
            >
              Add only the periods
              where you have classes.
              Other periods are
              automatically treated
              as free periods.
            </p>


            {/* DAYS */}

            <div
              style={{
                display:
                  "flex",
                gap: "8px",
                flexWrap:
                  "wrap",
                marginBottom:
                  "18px",
              }}
            >

              {timetableDays.map(
                (day) => (

                  <button
                    key={day}
                    type="button"
                    onClick={() => {

                      setTimetableDay(
                        day
                      );

                      resetTimetableForm();

                      setTimetableError(
                        ""
                      );

                      setTimetableSuccess(
                        ""
                      );

                    }}
                    style={{
                      width:
                        "auto",
                      marginTop:
                        0,
                      padding:
                        "9px 15px",
                      borderRadius:
                        "10px",
                      border:
                        "1px solid #cbd5e1",
                      background:
                        timetableDay ===
                        day
                          ? "#2563eb"
                          : "white",
                      color:
                        timetableDay ===
                        day
                          ? "white"
                          : "#334155",
                    }}
                  >
                    {day}
                  </button>

                )
              )}

            </div>


            {/* PERIODS */}

            {timetableLoading ? (
              <p
                style={{
                  color: "#64748b",
                }}
              >
                Loading timetable...
              </p>
            ) : (
              <div className="fd-period-grid-wrap">
                <div className="fd-period-grid">
                  {timetablePeriodCards}
                </div>
              </div>
            )}


            {/* ERROR */}

            {timetableError && (

              <div
                className="login-error"
                style={{
                  marginTop:
                    "14px",
                }}
              >
                {timetableError}
              </div>

            )}


            {/* SUCCESS */}

            {timetableSuccess && (

              <div
                style={{
                  color:
                    "#15803d",
                  background:
                    "#f0fdf4",
                  padding:
                    "10px 12px",
                  borderRadius:
                    "10px",
                  marginTop:
                    "14px",
                  fontSize:
                    "13px",
                }}
              >
                {timetableSuccess}
              </div>

            )}

          </div>



            </div>
              </section>
            )}

            {facultySection === "leave" && (
              <section className="fd-page-section">
                <div id="faculty-leave-section">
{/* =====================================================
    FACULTY LEAVE / HOLIDAY MANAGEMENT
===================================================== */}

<div
  style={{
    marginBottom: "24px",
    padding: "20px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  }}
>
  <h2
    style={{
      margin: "0 0 16px",
      color: "#0f172a",
      fontSize: "20px",
    }}
  >
    📅 Leave & Holiday Management
  </h2>

  {/* DATE */}
  <div
    style={{
      marginBottom: "16px",
    }}
  >
    <label
      style={{
        display: "block",
        marginBottom: "7px",
        fontWeight: "700",
        color: "#334155",
      }}
    >
      Select Date
    </label>

    <input
      type="date"
      value={facultySelectedDate}
      onChange={(e) => {
        const selectedDate =
          e.target.value;

        setFacultySelectedDate(
          selectedDate
        );

        fetchFacultyLeaveHoliday(
          selectedDate
        );
      }}
      style={{
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
      }}
    />
  </div>

  {/* CURRENT DATE STATUS */}
  {leaveHolidayLoading ? (
    <div
      style={{
        marginBottom: "16px",
        color: "#64748b",
        fontSize: "14px",
      }}
    >
      Checking leave and holiday status...
    </div>
  ) : (
    <>
      {facultyLeave && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
          }}
        >
          <strong>
            🔵 Leave Marked
          </strong>

          {facultyLeave.reason && (
            <div
              style={{
                marginTop: "5px",
                fontSize: "13px",
              }}
            >
              Reason:{" "}
              {facultyLeave.reason}
            </div>
          )}
        </div>
      )}

      {collegeHoliday && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#f5f3ff",
            border: "1px solid #ddd6fe",
            color: "#6d28d9",
          }}
        >
          <strong>
            🏖️ College Holiday
          </strong>

          <div
            style={{
              marginTop: "5px",
              fontSize: "13px",
            }}
          >
            {collegeHoliday.holiday_name}
          </div>

          {collegeHoliday.description && (
            <div
              style={{
                marginTop: "3px",
                fontSize: "13px",
              }}
            >
              {collegeHoliday.description}
            </div>
          )}
        </div>
      )}
    </>
  )}

  {/* LEAVE SECTION */}
  <div
    style={{
      marginBottom: "20px",
      padding: "16px",
      borderRadius: "12px",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
    }}
  >
    <h3
      style={{
        margin: "0 0 12px",
        fontSize: "16px",
        color: "#1e40af",
      }}
    >
      🔵 Faculty Leave
    </h3>

    <input
      type="text"
      placeholder="Leave reason (optional)"
      value={facultyLeaveReason}
      onChange={(e) =>
        setFacultyLeaveReason(
          e.target.value
        )
      }
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        marginBottom: "10px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
            <button
        type="button"
        onClick={markFacultyLeave}
        disabled={
          leaveHolidayLoading ||
          !!collegeHoliday
        }
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        📅 Mark Leave
      </button>

      {facultyLeave && (
        <button
          type="button"
          onClick={cancelFacultyLeave}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#dc2626",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ❌ Cancel Leave
        </button>
      )}
    </div>
  </div>

  {/* HOLIDAY SECTION */}
  <div
    style={{
      padding: "16px",
      borderRadius: "12px",
      background: "#ffffff",
      border: "1px solid #e2e8f0",
    }}
  >
    <h3
      style={{
        margin: "0 0 12px",
        fontSize: "16px",
        color: "#6d28d9",
      }}
    >
      🏖️ College Holiday
    </h3>

    <input
      type="text"
      placeholder="Holiday name"
      value={holidayName}
      onChange={(e) =>
        setHolidayName(
          e.target.value
        )
      }
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        marginBottom: "10px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
      }}
    />

    <textarea
      placeholder="Holiday description (optional)"
      value={holidayDescription}
      onChange={(e) =>
        setHolidayDescription(
          e.target.value
        )
      }
      rows={3}
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        marginBottom: "10px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "14px",
        resize: "vertical",
      }}
    />

    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
            <button
        type="button"
        onClick={markCollegeHoliday}
        disabled={
          leaveHolidayLoading ||
          !!facultyLeave
        }
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          background: "#7c3aed",
          color: "white",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        🏖️ Mark Holiday
      </button>

      {collegeHoliday && (
        <button
          type="button"
          onClick={cancelCollegeHoliday}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#dc2626",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          ❌ Cancel Holiday
        </button>
      )}
    </div>
  </div>
</div>
</div>
              </section>
            )}

            {facultySection === "tasks" && (
              <section className="fd-page-section">
                <div id="faculty-task-section">

{/* FACULTY TASK MANAGEMENT */}

<div
  style={{
    marginTop: "28px",
    padding: "24px",
    borderRadius: "16px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  }}
>
  <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    gap: "12px",
    flexWrap: "wrap",
  }}
>
    <div>
      <h2
        style={{
          margin: 0,
          fontSize: "22px",
          fontWeight: "700",
          color: "#111827",
        }}
      >
        Faculty Task Management
      </h2>

      <p
        style={{
          margin: "6px 0 0",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        Record and track tasks completed during free periods.
      </p>
{taskDateBlocked && (
  <div
    style={{
      marginBottom: "16px",
      padding: "12px 14px",
      borderRadius: "10px",
      background: facultyLeave
        ? "#eff6ff"
        : "#f5f3ff",
      border: facultyLeave
        ? "1px solid #bfdbfe"
        : "1px solid #ddd6fe",
      color: facultyLeave
        ? "#1d4ed8"
        : "#6d28d9",
      fontWeight: "700",
      fontSize: "14px",
    }}
  >
    {facultyLeave
      ? "🔵 This date is marked as Leave. Task entry is disabled."
      : "🏖️ This date is marked as Holiday. Task entry is disabled."}
  </div>
)}
    </div>

    {editingTaskId && (
      <span
        style={{
          padding: "7px 12px",
          borderRadius: "999px",
          background: "#eff6ff",
          color: "#2563eb",
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        Editing Task
      </span>
    )}
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "14px",
    }}
  >
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        Task Date
      </label>

      <input
  type="date"
  value={taskForm.taskDate}
  disabled={taskDateBlocked}
  onChange={(e) => {
          const selectedDate = e.target.value;
          const selectedDay =
            getDayFromTaskDate(selectedDate);

          const freePeriods =
            getFreeTaskPeriods(
              selectedDate,
              editingTaskId
                ? taskForm.periodNo
                : null
            );

          setTaskForm({
            ...taskForm,
            taskDate: selectedDate,
            dayOfWeek: selectedDay,
            periodNo:
              freePeriods.length > 0
                ? String(freePeriods[0])
                : "",
          });
        }}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
        }}
      />
    </div>

    <div>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        Day
      </label>

      <div
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
          background: "#f9fafb",
          color: taskForm.dayOfWeek
            ? "#111827"
            : "#9ca3af",
          minHeight: "40px",
        }}
      >
        {taskForm.dayOfWeek ||
          "Select task date"}
      </div>
    </div>

    <div>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        Period
      </label>

      <select
        value={taskForm.periodNo}
        onChange={(e) =>
          setTaskForm({
            ...taskForm,
            periodNo: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
          background: "#fff",
        }}
      >
        {getFreeTaskPeriods(
          taskForm.taskDate,
          editingTaskId
            ? taskForm.periodNo
            : null
        ).map((period) => (
          <option key={period} value={period}>
            P{period} — {periodTimes[period][0]} to{" "}
            {periodTimes[period][1]}
          </option>
        ))}

        {taskForm.taskDate &&
          getFreeTaskPeriods(
            taskForm.taskDate,
            editingTaskId
              ? taskForm.periodNo
              : null
          ).length === 0 && (
            <option value="">
              No Free Periods
            </option>
          )}
      </select>
    </div>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "14px",
      marginTop: "14px",
    }}
  >
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        Task Name
      </label>

      <input
        type="text"
        placeholder="Example: Student Counselling"
        value={taskForm.taskName}
        onChange={(e) =>
          setTaskForm({
            ...taskForm,
            taskName: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
        }}
      />
    </div>

    <div>
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#374151",
        }}
      >
        Completion Level
      </label>

      <select
        value={taskForm.statusLevel}
        onChange={(e) =>
          setTaskForm({
            ...taskForm,
            statusLevel: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box",
          background: "#fff",
        }}
      >
        <option value="L1">L1 — Partially Completed</option>
        <option value="L2">L2 — Moderately Completed</option>
        <option value="L3">L3 — Successfully Completed</option>
      </select>
    </div>
  </div>

  <div style={{ marginTop: "14px" }}>
    <label
      style={{
        display: "block",
        marginBottom: "6px",
        fontSize: "13px",
        fontWeight: "600",
        color: "#374151",
      }}
    >
      Task Description
    </label>

    <textarea
      rows="3"
      placeholder="Enter task details..."
      value={taskForm.taskDescription}
      onChange={(e) =>
        setTaskForm({
          ...taskForm,
          taskDescription: e.target.value,
        })
      }
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        boxSizing: "border-box",
        resize: "vertical",
      }}
    />
  </div>

  {facultyTasksError && (
    <div
      style={{
        marginTop: "14px",
        padding: "10px 12px",
        borderRadius: "8px",
        background: "#fef2f2",
        color: "#b91c1c",
        fontSize: "14px",
      }}
    >
      {facultyTasksError}
    </div>
  )}

  {facultyTasksSuccess && (
    <div
      style={{
        marginTop: "14px",
        padding: "10px 12px",
        borderRadius: "8px",
        background: "#f0fdf4",
        color: "#15803d",
        fontSize: "14px",
      }}
    >
      {facultyTasksSuccess}
    </div>
  )}

  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "16px",
      flexWrap: "wrap",
    }}
  >
    <button
  type="button"
  onClick={saveFacultyTask}
  disabled={
    facultyTasksLoading ||
    taskDateBlocked
  }
      disabled={
        facultyTasksLoading ||
        !taskForm.taskDate ||
        !taskForm.periodNo ||
        !taskForm.taskName.trim()
      }
      style={{
        padding: "10px 18px",
        border: "none",
        borderRadius: "8px",
        background: "#2563eb",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
        opacity:
          facultyTasksLoading ||
          !taskForm.taskDate ||
          !taskForm.periodNo ||
          !taskForm.taskName.trim()
            ? 0.6
            : 1,
      }}
    >
      {facultyTasksLoading
        ? "Saving..."
        : editingTaskId
        ? "Update Task"
        : "Add Task"}
    </button>

    {editingTaskId && (
      <button
        type="button"
        onClick={cancelEditingFacultyTask}
        style={{
          padding: "10px 18px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          background: "#fff",
          color: "#374151",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    )}
  </div>

  <div
    style={{
      marginTop: "28px",
      borderTop: "1px solid #e5e7eb",
      paddingTop: "20px",
    }}
  >
    <h3
      style={{
        margin: "0 0 14px",
        fontSize: "18px",
        color: "#111827",
      }}
    >
      My Tasks
    </h3>

    {facultyTasksLoading && facultyTasks.length === 0 ? (
      <p style={{ color: "#6b7280" }}>
        Loading tasks...
      </p>
    ) : facultyTasks.length === 0 ? (
      <p
        style={{
          padding: "20px",
          textAlign: "center",
          color: "#6b7280",
          background: "#f9fafb",
          borderRadius: "10px",
        }}
      >
        No tasks recorded yet.
      </p>
    ) : (
      <div
        style={{
          display: "grid",
          gap: "12px",
        }}
      >
        {facultyTasks.map((task) => {
          const levelStyle =
            task.status_level === "L3"
              ? {
                  background: "#dcfce7",
                  color: "#15803d",
                  label: "L3 — Successfully Completed",
                }
              : task.status_level === "L2"
              ? {
                  background: "#fef3c7",
                  color: "#a16207",
                  label: "L2 — Moderately Completed",
                }
              : {
                  background: "#fee2e2",
                  color: "#b91c1c",
                  label: "L1 — Partially Completed",
                };

          return (
            <div
              key={task.id}
              style={{
                padding: "16px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "700",
                      fontSize: "16px",
                      color: "#111827",
                    }}
                  >
                    {task.task_name}
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#6b7280",
                      fontSize: "13px",
                    }}
                  >
                    {task.task_date} • {task.day_of_week} • P{task.period_no}
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      color: "#6b7280",
                      fontSize: "12px",
                    }}
                  >
                    {periodTimes[task.period_no]
                      ? periodTimes[task.period_no][0] +
                        " - " +
                        periodTimes[task.period_no][1]
                      : ""}
                  </div>
                </div>

                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: levelStyle.background,
                    color: levelStyle.color,
                    fontSize: "12px",
                    fontWeight: "700",
                  }}
                >
                  {levelStyle.label}
                </span>
              </div>

              {task.task_description && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#f9fafb",
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {task.task_description}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={() => startEditingFacultyTask(task)}
                  style={{
                    padding: "7px 12px",
                    border: "1px solid #bfdbfe",
                    borderRadius: "7px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this task?"
                      )
                    ) {
                      deleteFacultyTask(task.id);
                    }
                  }}
                  style={{
                    padding: "7px 12px",
                    border: "1px solid #fecaca",
                    borderRadius: "7px",
                    background: "#fef2f2",
                    color: "#dc2626",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
</div>

</div>
              </section>
            )}

            {facultySection === "reports" && (
              <section className="fd-page-section">
                <div id="faculty-report-section">
{/* FACULTY REPORTS */}
<div
  style={{
    marginTop: "24px",
    padding: "20px",
    borderRadius: "16px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  }}
>
  <h2
    style={{
      margin: "0 0 8px 0",
      fontSize: "20px",
      fontWeight: 800,
      color: "#0f172a",
    }}
  >
    📊 Faculty Reports
  </h2>

  <p
    style={{
      margin: "0 0 18px 0",
      color: "#64748b",
      fontSize: "13px",
    }}
  >
    View your complete P1–P8 daily activity report.
  </p>

  <div
    style={{
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      alignItems: "end",
    }}
  >
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 700,
          marginBottom: "6px",
          color: "#0f172a",
        }}
      >
        From Date
      </label>

      <input
        type="date"
        id="reportFromDate"
        style={{
          padding: "9px 11px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
        }}
      />
    </div>

    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 700,
          marginBottom: "6px",
          color: "#0f172a",
        }}
      >
        To Date
      </label>

      <input
        type="date"
        id="reportToDate"
        style={{
          padding: "9px 11px",
          borderRadius: "8px",
          border: "1px solid #cbd5e1",
        }}
      />
    </div>

    <button
      type="button"
      onClick={async () => {
        const from =
          document.getElementById("reportFromDate")?.value;

        const to =
          document.getElementById("reportToDate")?.value;

        if (!from || !to) {
          alert("Please select both From Date and To Date.");
          return;
        }

        try {
          const token =
            sessionStorage.getItem("facultyToken");

          const response = await fetch(
            `${API_URL}/api/faculty/reports?from=${from}&to=${to}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.error || "Unable to fetch report"
            );
          }

          let dayStatus = null;

          // A single-date report must check Leave/Holiday before showing timetable.
          if (from === to) {
            try {
              const leaveResponse = await fetch(
                `${API_URL}/api/faculty/leave?date=${from}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const leaveData = await leaveResponse.json();

              const holidayResponse = await fetch(
                `${API_URL}/api/holidays?date=${from}`
              );

              const holidayData = await holidayResponse.json();

              // College Holiday has priority because it applies to the whole college.
              if (holidayResponse.ok && holidayData.holiday) {
                dayStatus = {
                  type: "Holiday",
                  name: holidayData.holiday.holiday_name || "College Holiday",
                  description: holidayData.holiday.description || "",
                };
              } else if (leaveResponse.ok && leaveData.leave) {
                dayStatus = {
                  type: "Leave",
                  reason: leaveData.leave.reason || "",
                };
              }
            } catch (statusError) {
              console.error(
                "Unable to check report Leave/Holiday status:",
                statusError
              );
            }
          }

          setReportDayStatus(dayStatus);

          if (dayStatus) {
            setFacultyReport({
              ...data,
              dayStatus,
              periods: [],
              tasks: [],
              summary: {
                totalTasks: 0,
                l1Count: 0,
                l2Count: 0,
                l3Count: 0,
                completionPercentage: 0,
              },
            });
          } else {
            setFacultyReport({
              ...data,
              dayStatus: null,
            });
          }
        } catch (error) {
          console.error(
            "Faculty report error:",
            error
          );

          alert(
            error.message ||
            "Unable to fetch report."
          );
        }
      }}
      style={{
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        background: "#2563eb",
        color: "#ffffff",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Generate Report
    </button>
  </div>

  {facultyReport && (
    <div
      style={{
        marginTop: "24px",
        borderTop: "1px solid #e5e7eb",
        paddingTop: "20px",
      }}
    >
      <h3
        style={{
          margin: "0 0 6px 0",
          color: "#0f172a",
          fontSize: "18px",
          fontWeight: 800,
        }}
      >
        📊 Faculty Report
      </h3>

      <div
        style={{
          fontSize: "13px",
          color: "#475569",
          marginBottom: "18px",
        }}
      >
        {facultyReport.from === facultyReport.to
          ? `Date: ${facultyReport.from}`
          : `Period: ${facultyReport.from} to ${facultyReport.to}`}
      </div>

      {facultyReport.dayStatus && (
        <div
          style={{
            padding: "20px",
            marginBottom: "22px",
            borderRadius: "14px",
            border: facultyReport.dayStatus.type === "Holiday"
              ? "1px solid #fde68a"
              : "1px solid #bfdbfe",
            background: facultyReport.dayStatus.type === "Holiday"
              ? "#fffbeb"
              : "#eff6ff",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            {facultyReport.dayStatus.type === "Holiday"
              ? "🏖️ College Holiday"
              : "🔵 Faculty Leave"}
          </div>

          <div
            style={{
              marginTop: "8px",
              color: "#475569",
              fontSize: "13px",
            }}
          >
            {facultyReport.dayStatus.type === "Holiday"
              ? facultyReport.dayStatus.name || "College Holiday"
              : "Faculty is on leave for this date."}
          </div>

          {facultyReport.dayStatus.type === "Leave" &&
            facultyReport.dayStatus.reason && (
              <div
                style={{
                  marginTop: "6px",
                  color: "#64748b",
                  fontSize: "12px",
                }}
              >
                Reason: {facultyReport.dayStatus.reason}
              </div>
            )}

          <div
            style={{
              marginTop: "12px",
              paddingTop: "10px",
              borderTop: "1px solid rgba(148,163,184,.25)",
              color: "#64748b",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            P1–P8 timetable and task activity are not applicable for this date.
          </div>
        </div>
      )}

      {!facultyReport.dayStatus && facultyReport.periods &&
        facultyReport.periods.length > 0 && (
          <div
            style={{
              overflowX: "auto",
              marginBottom: "22px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
                background: "#ffffff",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#eff6ff",
                    color: "#0f172a",
                  }}
                >
                  <th style={reportCellStyle}>
                    Period
                  </th>

                  <th style={reportCellStyle}>
                    Time
                  </th>

                  <th style={reportCellStyle}>
                    Activity
                  </th>

                  <th style={reportCellStyle}>
                    Details
                  </th>

                  <th style={reportCellStyle}>
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {facultyReport.periods.map(
                  (period) => (
                    <tr key={period.periodNo}>
                      <td
                        style={{
                          ...reportCellStyle,
                          fontWeight: 800,
                        }}
                      >
                        P{period.periodNo}
                      </td>

                      <td style={reportCellStyle}>
                        {period.time}
                      </td>

                      <td
                        style={{
                          ...reportCellStyle,
                          fontWeight: 700,
                        }}
                      >
                        {period.activityType}
                      </td>

                      <td style={reportCellStyle}>
                        {period.activityType ===
                        "Class" ? (
                          <>
                            <strong>
                              {period.subject}
                            </strong>
                            <br />
                            {period.className}
                            {period.section
                              ? ` - ${period.section}`
                              : ""}
                            {period.room
                              ? ` · Room ${period.room}`
                              : ""}
                          </>
                        ) : period.activityType ===
                          "Task" ? (
                          <>
                            <strong>
                              {period.taskName}
                            </strong>

                            {period.taskDescription && (
                              <>
                                <br />
                                {period.taskDescription}
                              </>
                            )}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>

                      <td style={reportCellStyle}>
                        {period.activityType ===
                        "Class" ? (
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "#dbeafe",
                              color: "#1d4ed8",
                              fontWeight: 800,
                            }}
                          >
                            🏫 CLASS
                          </span>
                        ) : period.statusLevel ===
                          "L1" ? (
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "#fee2e2",
                              color: "#b91c1c",
                              fontWeight: 800,
                            }}
                          >
                            🔴 L1
                          </span>
                        ) : period.statusLevel ===
                          "L2" ? (
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "#fef3c7",
                              color: "#a16207",
                              fontWeight: 800,
                            }}
                          >
                            🟡 L2
                          </span>
                        ) : period.statusLevel ===
                          "L3" ? (
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "#dcfce7",
                              color: "#15803d",
                              fontWeight: 800,
                            }}
                          >
                            🟢 L3
                          </span>
                        ) : (
                          <span
                            style={{
                              display:
                                "inline-block",
                              padding: "5px 9px",
                              borderRadius: "999px",
                              background: "#dcfce7",
                              color: "#15803d",
                              fontWeight: 800,
                            }}
                          >
                            🟢 FREE
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "18px",
        }}
      >
        <button
          type="button"
          onClick={generateFacultyReportPDF}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#dc2626",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          }}
        >
          Download PDF
        </button>
      </div>

      {!facultyReport.dayStatus && (
        <>
      <h3
        style={{
          margin: "0 0 12px 0",
          color: "#0f172a",
          fontSize: "16px",
          fontWeight: 800,
        }}
      >
        📈 Completion
      </h3>

      <div
        style={{
          height: "18px",
          width: "100%",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: `${facultyReport.summary.completionPercentage}%`,
            height: "100%",
            background: "#22c55e",
            borderRadius: "999px",
          }}
        />
      </div>

      <div
        style={{
          fontWeight: 800,
          color: "#15803d",
          marginBottom: "18px",
        }}
      >
        {facultyReport.summary.completionPercentage}%
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(110px, 1fr))",
          gap: "10px",
          marginBottom: "22px",
        }}
      >
        <div style={reportSummaryStyle}>
          <strong>Total Tasks</strong>
          <span>
            {facultyReport.summary.totalTasks}
          </span>
        </div>

        <div style={reportSummaryStyle}>
          <strong>🔴 L1</strong>
          <span>
            {facultyReport.summary.l1Count}
          </span>
        </div>

        <div style={reportSummaryStyle}>
          <strong>🟡 L2</strong>
          <span>
            {facultyReport.summary.l2Count}
          </span>
        </div>

        <div style={reportSummaryStyle}>
          <strong>🟢 L3</strong>
          <span>
            {facultyReport.summary.l3Count}
          </span>
        </div>
            </div>


      <h3
        style={{
          margin: "0 0 12px 0",
          color: "#0f172a",
          fontSize: "16px",
          fontWeight: 800,
        }}
      >
        Task Details
      </h3>

      {facultyReport.tasks &&
      facultyReport.tasks.length > 0 ? (
        <div>
          {facultyReport.tasks.map(
            (task) => (
              <div
                key={task.id}
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  borderRadius: "10px",
                  border:
                    "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong
                    style={{
                      color: "#0f172a",
                    }}
                  >
                    P{task.period_no} —{" "}
                    {task.task_name}
                  </strong>

                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                      marginTop: "4px",
                    }}
                  >
                    {task.task_date} •{" "}
                    {task.day_of_week}
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "12px",
                  }}
                >
                  {task.status_level ===
                  "L1"
                    ? "🔴 L1"
                    : task.status_level ===
                      "L2"
                    ? "🟡 L2"
                    : "🟢 L3"}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div
          style={{
            padding: "12px",
            background: "#f8fafc",
            borderRadius: "10px",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          No tasks found for this period.
        </div>
      )}
        </>
      )}
    </div>
  )}
</div>


</div>

              </section>
            )}

          </main>
        </div>
      </div>
    </>
  );
}

// ============================================================
  // ADMIN DASHBOARD
  // ============================================================

  if (
    page ===
    "admin-dashboard"
  ) {

    let adminUser = null;

    try {

      adminUser =
        JSON.parse(
          sessionStorage.getItem(
            "adminUser"
          ) || "null"
        );

    } catch {

      adminUser = null;

    }

    return (
      <AdminDashboard
        adminUser={
          adminUser
        }
        onLogout={
          handleAdminLogout
        }
      />
    );
  }

  // ============================================================
  // VIEWER
  // ============================================================

  if (
    page ===
    "viewer"
  ) {

    return (
      <>
        <style>
          {
            GLOBAL_STYLES +
            COMMON_LOGIN_STYLES
          }
        </style>

        <div className="login-page">

          <div className="login-card">

            <h1>
              HOD Availability
            </h1>

            <p className="login-subtitle">
              Public viewer
            </p>

            <p>
              Current HOD Status:{" "}

              <strong>
                {
                  hodStatus ||
                  "Loading..."
                }
              </strong>
            </p>

            <button
              onClick={() => {

                setPage(
                  "home"
                );

                window.history.pushState(
                  {},
                  "",
                  "/"
                );

              }}
            >
              ← Back
            </button>

          </div>

        </div>
      </>
    );
  }

  return null;
}

export default App;












