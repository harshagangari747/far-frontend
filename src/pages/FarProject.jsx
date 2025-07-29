import NavBar from "../components/NavBar";
export default function FarProject() {
  return (
    <div className="flex-grow bg-gray-50 min-h-screen p-6 font-mono">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          About Find A Roof (FAR)
        </h1>

        <section className="mb-6">
          <p className="mb-4">
            <strong>Find A Roof (FAR)</strong> is a rental discovery platform
            created to simplify how people find and post homes for rent with{" "}
            <strong>zero commission</strong>,{" "}
            <strong>transparent listings</strong>, and{" "}
            <strong>user-friendly features</strong>.
          </p>
          <p>
            Currently in its{" "}
            <em>pilot phase across southern states of India</em>, FAR is a
            passion project aimed at empowering both homeowners and tenants to
            connect directly and efficiently.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Background </h2>
          <p>
            In January 2025, I, along with my father and brother, was urgently
            traveling to a new place to help my brother join a company. Since it
            was a permanent job opportunity, we needed to find a place where he
            could rent a home.
            <br />
            But we couldn't find anyone who could offer a rental on the spot, as
            it was a completely unfamiliar location to us.
            <br />I was tense and frustrated because we couldn’t find a home
            within a short span of time. After a day of intense searching — and
            purely by luck — we were able to find a place to rent. Though I was
            relieved, it sparked an idea: why don’t we have a{" "}
            <strong>dedicated</strong> web application that helps people like us
            find nearby rentals more easily? This application was born from that
            experience.
          </p>

          <p>
            In May 2025, I achieved the AWS Cloud Developer Certification, but I
            didn’t have a solid project to showcase my skills.
            <br />
            So I decided to build this application as a side project. The
            backend of the project is completely hosted on AWS, embracing a
            serverless architecture. Key AWS services like API Gateway,
            DynamoDB, Lambda, S3, and Cognito were used to build a scalable and
            cost-effective solution.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">What FAR Offers</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Smart Search Experience</strong>: Browse homes by
              location, rent, BHK, amenities, and more.
            </li>
            <li>
              <strong>Effortless Listings for Owners</strong>: Post your
              property in minutes with photos, preferences, and pricing — no
              agents needed.
            </li>
            <li>
              <strong>Matching Interests</strong>: Express interest in listings
              and get matched based on preferences and availability.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Its a Test Project</h2>
          <p>
            This is a <em>test launch</em> across select southern states to
            gather feedback and improve quickly. Your involvement helps shape a
            platform built with users in mind.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Built by a Developer Who Gets It
          </h2>
          <p>
            Hello! I'm <strong>Sai Harsha Gangari</strong>, a software engineer
            who built FAR to address the challenges I faced finding rental homes
            in India and also to prove my skills in AWS cloud development.
          </p>
          <p>
            I graduated from{" "}
            <em>
              <strong>
                George Washington Unviersity (Master of Science in Computer
                Science)
              </strong>
            </em>{" "}
            in the year 2025. Prior to the master's, I completed my bachelor's
            in Computer Science from Osmania University, Hyderabad, India in
            2021.
            <br />
            From the year 2021-2023, I worked as full time Software Engineer in
            the .NET stack at Cognizant Limited, India and EPAM Systems India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            My Social Media Profiles
          </h2>
          <a href="https://www.linkedin.com/in/sai-harsha-gangari">Linked In</a>{" "}
          | <a href="https://www.github.com/harshagangari747">GitHub</a>
        </section>
      </div>
    </div>
  );
}
