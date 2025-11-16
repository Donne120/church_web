import { Card, CardContent } from '@/components/ui/card';
import { Target, Eye, BookOpen, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0D2B66] mb-4">About CYSMF</h1>
          <p className="text-lg text-gray-600">
            Christian Youth and Students Missionary Fellowship
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#0D2B66] rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#0D2B66]">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To reach students on university campuses across Rwanda with the Gospel of Jesus Christ,
                disciple them in their faith, and equip them to be effective witnesses in
                their spheres of influence.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-[#FFB703] rounded-lg">
                  <Eye className="h-6 w-6 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-[#0D2B66]">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To see every student on every campus transformed by the power of the Gospel,
                living as bold witnesses for Christ, and impacting their generation for the
                Kingdom of God.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#0D2B66] mb-6 text-center">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-[#0D2B66]">Biblical Foundation</h3>
                <p className="text-gray-700">
                  We are committed to the authority and sufficiency of Scripture in all matters
                  of faith and practice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-[#0D2B66]">Prayer</h3>
                <p className="text-gray-700">
                  We believe in the power of prayer and seek God's guidance in all our endeavors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-[#0D2B66]">Discipleship</h3>
                <p className="text-gray-700">
                  We are committed to making disciples who make disciples, multiplying our impact.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-[#0D2B66]">Excellence</h3>
                <p className="text-gray-700">
                  We strive for excellence in all we do, as unto the Lord.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What We Believe */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#0D2B66] rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#0D2B66]">What We Believe</h2>
          </div>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">The Bible</h3>
                <p className="text-gray-700">
                  We believe the Bible is the inspired, infallible Word of God and our final
                  authority in all matters of faith and conduct.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">The Trinity</h3>
                <p className="text-gray-700">
                  We believe in one God eternally existing in three persons: Father, Son, and
                  Holy Spirit.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Salvation</h3>
                <p className="text-gray-700">
                  We believe that salvation is by grace alone, through faith alone, in Christ
                  alone. Jesus Christ died for our sins and rose again, offering eternal life
                  to all who believe.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">The Church</h3>
                <p className="text-gray-700">
                  We believe in the universal Church, the body of Christ, composed of all true
                  believers in Jesus Christ.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">The Great Commission</h3>
                <p className="text-gray-700">
                  We believe every Christian is called to make disciples of all nations, teaching
                  them to observe all that Christ commanded.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leadership */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#FFB703] rounded-lg">
              <Users className="h-6 w-6 text-black" />
            </div>
            <h2 className="text-3xl font-bold text-[#0D2B66]">Leadership</h2>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                CYSMF is led by a dedicated team of leaders who are passionate about reaching
                students with the Gospel. Our leadership structure includes:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#FFB703] font-bold">•</span>
                  <span><strong>National Secretariat:</strong> Provides overall direction and coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFB703] font-bold">•</span>
                  <span><strong>Regional Leaders:</strong> Oversee ministry in specific regions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FFB703] font-bold">•</span>
                  <span><strong>Campus Leaders:</strong> Lead ministry on individual campuses</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

