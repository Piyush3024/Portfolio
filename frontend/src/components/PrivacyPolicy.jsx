import {  useRef } from "react";

export default function PrivacyPolicy() {

  const pageRef = useRef(null);

 

  return (
    <div
      ref={pageRef}
      className="min-h-screen max-w-full top-12  flex flex-col items-center px-4 md:px-8 lg:px-16 py-8"
      
    >
     
          <div
            className="p-6 sm:p-8 rounded-lg mt-4 bg-opacity-30 backdrop-blur-sm"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.4) 0%, rgba(17, 24, 39, 0.8) 70%)`,
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Privacy <span className="text-cyan-400">Policy</span>
            </h1>

            <div className="text-gray-200 space-y-6">
              {/* <p>
                Last updated: {new Date().toLocaleDateString()}
              </p> */}
              <p>
                <strong>Effective Date:</strong> May 15, 2025
              </p>

              <section>
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  1. Introduction
                </h2>
                <p>
                  Welcome to Piyush Bhul&apos;s personal website. I respect your
                  privacy and am committed to protecting your personal data.
                  This Privacy Policy explains how I collect, use, and safeguard
                  your information when you visit my website.
                </p>
                <p className="mt-2">
                  By using this website, you consent to the terms of this
                  Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  2. Information I Collect
                </h2>
                <p>I may collect the following types of information:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    <strong>Personal Information:</strong> Name and email
                    address if you contact me through the contact form.
                  </li>
                  <li>
                    <strong>Log Data:</strong> IP address, browser type, pages
                    visited, time spent, and other statistics.
                  </li>
                  <li>
                    <strong>Cookies:</strong> Small files stored on your device
                    to enhance user experience and analyze website traffic.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  3. How I Use Your Information
                </h2>
                <p>
                  I use the collected information for the following purposes:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    To respond to your inquiries and provide requested services
                  </li>
                  <li>To improve and optimize my website</li>
                  <li>To analyze usage patterns and administer the site</li>
                  <li>To personalize your experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  4. Third-Party Services
                </h2>
                <p>
                  This website may use third-party services that collect
                  information, including:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Google Analytics to analyze website traffic</li>
                  <li>
                    Google AdSense for displaying advertisements (if applicable)
                  </li>
                  <li>Social media integrations for sharing content</li>
                </ul>
                <p className="mt-2">
                  These third-party services have their own privacy policies
                  governing their use of your information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  5. Cookie Policy
                </h2>
                <p>
                  This website uses cookies to enhance your browsing experience.
                  You can choose to disable cookies in your browser settings,
                  but this may limit some website functionality.
                </p>
                <p className="mt-2">
                  Google, as a third-party vendor, uses cookies to serve ads on
                  this website. Google&apos;s use of the DART cookie enables it to
                  serve ads based on your visit to this site and other sites on
                  the Internet. You can opt out of the use of the DART cookie by
                  visiting the{" "}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline"
                  >
                    Google Ad and Content Network Privacy Policy
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  6. Data Security
                </h2>
                <p>
                  I implement appropriate security measures to protect your
                  information from unauthorized access, alteration, disclosure,
                  or destruction. However, no method of transmission over the
                  internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  7. Your Rights
                </h2>
                <p>
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Access to your personal data</li>
                  <li>Correction of inaccurate personal data</li>
                  <li>Deletion of your personal data</li>
                  <li>Restriction of processing of your personal data</li>
                  <li>Data portability</li>
                  <li>Objection to processing of your personal data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  8. Children&apos;s Privacy
                </h2>
                <p>
                  This website is not intended for children under 13 years of
                  age. I do not knowingly collect personal information from
                  children under 13.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  9. Changes to This Privacy Policy
                </h2>
                <p>
                  I may update this Privacy Policy from time to time. Any
                  changes will be posted on this page with an updated revision
                  date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-cyan-400 mb-3">
                  10. Contact Information
                </h2>
                <p>
                  If you have any questions or concerns about this Privacy
                  Policy, please contact me through the Contact page on this
                  website.
                </p>
              </section>
            </div>
          </div>
        </div>
    
  );
}
