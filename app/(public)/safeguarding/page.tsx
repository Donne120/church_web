import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Phone, Mail } from 'lucide-react';

export default function SafeguardingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-[#0D2B66]" />
          <h1 className="text-4xl font-bold text-[#0D2B66]">Safeguarding Policy</h1>
        </div>
        <p className="text-gray-600 mb-8">Protecting our community members</p>

        <Card className="mb-8 bg-[#0D2B66] text-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Report a Concern</h3>
                <p className="mb-3">
                  If you have safeguarding concerns, please contact us immediately:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Emergency: +250 XXX XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>safeguarding@cysmf.org</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Our Commitment</h2>
              <p className="text-gray-700 leading-relaxed">
                CYSMF is committed to creating and maintaining a safe environment for all members,
                particularly young people and vulnerable adults. We recognize our responsibility to
                safeguard the welfare of all those who participate in our activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Policy Statement</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We believe that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Every person has value and dignity as made in the image of God</li>
                <li>Everyone has the right to be protected from abuse and harm</li>
                <li>Safeguarding is everyone's responsibility</li>
                <li>Prevention is better than cure</li>
                <li>Those who have been harmed deserve appropriate support and justice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Scope</h2>
              <p className="text-gray-700 leading-relaxed">
                This policy applies to all CYSMF activities, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                <li>Campus fellowship meetings and events</li>
                <li>Online activities and communications</li>
                <li>Conferences and retreats</li>
                <li>One-on-one mentorship and discipleship</li>
                <li>Social media interactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Safe Recruitment</h2>
              <p className="text-gray-700 leading-relaxed">
                All leaders and volunteers undergo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                <li>Application and interview process</li>
                <li>Reference checks</li>
                <li>Safeguarding training</li>
                <li>Agreement to our code of conduct</li>
                <li>Regular supervision and support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Code of Conduct</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                All CYSMF leaders and volunteers must:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Treat everyone with respect and dignity</li>
                <li>Maintain appropriate boundaries in relationships</li>
                <li>Avoid situations that could be misinterpreted</li>
                <li>Report any concerns promptly</li>
                <li>Never abuse their position of trust</li>
                <li>Maintain confidentiality appropriately</li>
                <li>Model Christ-like behavior at all times</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Types of Abuse</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We recognize various forms of abuse including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Physical abuse</li>
                <li>Emotional/psychological abuse</li>
                <li>Sexual abuse and harassment</li>
                <li>Spiritual abuse</li>
                <li>Neglect</li>
                <li>Financial abuse</li>
                <li>Online/cyber abuse</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Reporting Procedures</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                If you have a safeguarding concern:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Ensure immediate safety if there is imminent danger</li>
                <li>Contact the Safeguarding Officer or designated person</li>
                <li>Document what you have seen or heard</li>
                <li>Do not investigate yourself</li>
                <li>Maintain confidentiality (only share on a need-to-know basis)</li>
                <li>Follow up to ensure action has been taken</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Responding to Disclosures</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                If someone discloses abuse to you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Listen carefully and take them seriously</li>
                <li>Reassure them they were right to tell you</li>
                <li>Do not promise confidentiality</li>
                <li>Do not ask leading questions</li>
                <li>Record what was said as soon as possible</li>
                <li>Report to the Safeguarding Officer immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Data Protection and Consent</h2>
              <p className="text-gray-700 leading-relaxed">
                We take data protection seriously and ensure:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                <li>Appropriate consent for photos, videos, and personal information</li>
                <li>Secure storage of sensitive information</li>
                <li>Clear procedures for handling and sharing data</li>
                <li>Regular review of consent and data retention</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Training and Support</h2>
              <p className="text-gray-700 leading-relaxed">
                CYSMF provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                <li>Regular safeguarding training for all leaders</li>
                <li>Clear guidelines and resources</li>
                <li>Support for those affected by abuse</li>
                <li>Access to professional counseling services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Policy Review</h2>
              <p className="text-gray-700 leading-relaxed">
                This policy is reviewed annually and updated as needed to reflect best practices
                and legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#0D2B66] mb-3">Contact Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg mt-3">
                <p className="font-semibold mb-2">Safeguarding Officer</p>
                <div className="space-y-1 text-gray-700">
                  <p>Email: safeguarding@cysmf.org</p>
                  <p>Phone: +250 XXX XXX XXX</p>
                  <p className="text-sm mt-3 text-gray-600">
                    For emergencies, contact local authorities immediately.
                  </p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

