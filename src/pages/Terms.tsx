import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Users, AlertCircle, CheckCircle, Scale, Star } from 'lucide-react';
import Footer from '../components/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const Terms: React.FC = () => {
  const termsData = [
    {
      title: "Registration & Participation",
      icon: Users,
      content: [
        "Registration is mandatory for all participants and must be completed before the specified deadline",
        "Participants must be currently enrolled students with valid student identification",
        "Team composition cannot be changed after registration confirmation",
        "Registration fees, if applicable, are non-refundable under any circumstances",
        "Participants must attend all mandatory briefing sessions and orientation programs",
        "Late arrivals may result in disqualification from specific events or the entire competition"
      ]
    },
    {
      title: "Intellectual Property Rights",
      icon: Shield,
      content: [
        "All original work created during the event remains the intellectual property of the participants",
        "Participants grant InnovateX25 and Reelhaus Hyd the right to use their work for promotional purposes",
        "Any plagiarism or copyright infringement will result in immediate disqualification",
        "Participants are responsible for ensuring their submissions do not violate third-party rights",
        "The organizing committee reserves the right to verify the originality of all submissions",
        "Participants may be required to provide proof of concept or development process"
      ]
    },
    {
      title: "Liability & Safety",
      icon: AlertCircle,
      content: [
        "Participants attend the event at their own risk and responsibility",
        "The organizing committee is not liable for any personal injury, loss, or damage to property",
        "Participants must follow all safety protocols and venue guidelines",
        "Any medical conditions or allergies must be disclosed during registration",
        "Emergency contact information must be provided and kept updated",
        "Participants are responsible for their personal belongings throughout the event"
      ]
    },
    {
      title: "Code of Conduct & Behavior",
      icon: Scale,
      content: [
        "All participants must maintain professional and respectful behavior",
        "Discrimination, harassment, or inappropriate conduct will not be tolerated",
        "Participants must respect the decisions of judges and organizing committee",
        "Any form of cheating, misconduct, or violation of rules will result in disqualification",
        "Participants must comply with the dress code and venue regulations",
        "Consumption of alcohol or prohibited substances is strictly forbidden"
      ]
    },
    {
      title: "Privacy & Media Rights",
      icon: FileText,
      content: [
        "Participants consent to photography and videography during the event",
        "Media content may be used for promotional, educational, and archival purposes",
        "Personal information collected will be used solely for event management",
        "Participants have the right to request removal of their personal data post-event",
        "Social media posts about the event should maintain professional standards",
        "Participants may be featured in press releases and promotional materials"
      ]
    },
    {
      title: "Event Modifications & Cancellations",
      icon: CheckCircle,
      content: [
        "The organizing committee reserves the right to modify event schedules or format",
        "Changes will be communicated through official channels in advance",
        "In case of force majeure events, the competition may be postponed or cancelled",
        "Alternative arrangements will be made for virtual participation if necessary",
        "Refund policies will be clearly communicated in case of event cancellation",
        "Participants will be notified of any significant changes via registered contact information"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50 to-gray-100">
      <motion.main 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="relative max-w-6xl mx-auto px-6 py-32"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-16 w-16 text-indigo-500 mr-4" />
            <h1 className="text-6xl md:text-7xl font-extrabold gradient-title premium-font">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms and conditions carefully before participating in InnovateX25. 
            Your participation constitutes acceptance of these terms.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-8 rounded-2xl shadow-lg text-white mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Agreement to Terms</h2>
            <p className="text-indigo-100 max-w-3xl mx-auto">
              By registering for and participating in InnovateX25, you acknowledge that you have read, 
              understood, and agree to be bound by these terms and conditions. If you do not agree 
              with any part of these terms, please do not participate in the event.
            </p>
          </div>
        </motion.div>

        <div className="space-y-12">
          {termsData.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <motion.div 
                key={section.title}
                variants={itemVariants}
                className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-indigo-200/50"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-100 p-3 rounded-full mr-4">
                    <IconComponent className="h-8 w-8 text-indigo-500" />
                  </div>
                  <h2 className="text-3xl font-bold gradient-title premium-font">{section.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start p-4 bg-indigo-50 rounded-lg">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-4 mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div variants={itemVariants} className="mt-16 bg-gradient-to-r from-yellow-500 to-yellow-600 p-8 rounded-2xl shadow-lg text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
            <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
              For any questions regarding these terms and conditions or the event in general, 
              please contact our organizing team.
            </p>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/20 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-yellow-100">reelhaus.hyd@gmail.com</p>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <h3 className="font-bold mb-2">Phone</h3>
                <p className="text-yellow-100">+91 9392449721 / +91 9110387918</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 bg-gradient-to-r from-indigo-500 to-indigo-600 p-8 rounded-2xl shadow-lg text-white text-center">
          <Star className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Participate?</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            By clicking the registration button, you confirm that you have read and accepted 
            all terms and conditions outlined above.
          </p>
          <button className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors">
            I Agree - Register Now
          </button>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Terms;