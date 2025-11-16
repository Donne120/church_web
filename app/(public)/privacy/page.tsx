import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#0D2B66] mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: November 2025</p>

        <Card>
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Christian Youth and Students Missionary Fellowship (CYSMF) is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Information We Collect</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may collect information about you in a variety of ways, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Personal Data: Name, email address, phone number, university affiliation</li>
                <li>Usage Data: Information about how you use our website and services</li>
                <li>Communications: Messages, prayer requests, and other submissions</li>
                <li>Event Participation: Registration and attendance information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide and maintain our services</li>
                <li>Communicate with you about events, programs, and opportunities</li>
                <li>Respond to your inquiries and requests</li>
                <li>Improve our website and services</li>
                <li>Send newsletters and updates (with your consent)</li>
                <li>Ensure the safety and security of our community</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share
                your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect the rights and safety of CYSMF and our community</li>
                <li>With service providers who assist in our operations (under strict confidentiality agreements)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your
                personal information. However, no method of transmission over the Internet or electronic
                storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to improve your experience on our website.
                You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are primarily directed at university students (18+). We do not knowingly
                collect personal information from children under 13. If we become aware that we have
                collected such information, we will take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-3 text-gray-700">
                <p>Email: privacy@cysmf.org</p>
                <p>Phone: +250 XXX XXX XXX</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

