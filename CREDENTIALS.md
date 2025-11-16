# 🔐 Hardcoded Login Credentials

This document provides the simplified login credentials for accessing the CYSMF Leaders' Portal.
These credentials bypass Supabase authentication for quick access and testing.

---

## Username: `Welcome`
## Password: `John3!16`

---

### How to Log In:

1.  **Ensure your development server is running.**
2.  Open your browser and go to: **`http://localhost:3000/auth`**
3.  Enter the **Username**: `Welcome`
4.  Enter the **Password**: `John3!16`
5.  Click the "Sign In" button.

You should be redirected to the `/portal` dashboard immediately.

---

### What to Expect:

*   **Instant Access**: No email verification or magic links.
*   **Portal Dashboard**: You will see the pre-populated dashboard with KPI cards, charts, and reports.
*   **Admin Role**: The logged-in user will have an 'ADMIN' role for full access.

---

### Customization (Advanced):

If you wish to change these credentials, you can edit the `VALID_USERNAME` and `VALID_PASSWORD` constants in:
`cysmf-app/app/(public)/auth/page.tsx`

---

### Important Note:

This hardcoded login is for **development and testing purposes only**. For a production environment,
you would revert to a secure authentication method like Supabase Auth.
