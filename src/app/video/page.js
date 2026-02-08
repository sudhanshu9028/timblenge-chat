'use client';

import ConsentModal from '../components/ConsentModal';
import styles from '@/styles/chatVideoPage.module.scss';

export default function VideoPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.seoContent}>
        <h1 className={styles.seoTitle}>Video Chat with Strangers Online - 18+ Only</h1>
        <p className={styles.seoDescription}>
          <strong>18+ Only - Age Verification Required:</strong> This is a consent and age
          verification page. You must be 18 years or older to start video chat. Connect face-to-face
          with strangers from around the world through our secure video chat platform. Anoniz offers
          anonymous video chat where you can meet new people, make friends, and have real-time video
          conversations - no registration or sign-up required. To start video chat, please verify
          your age and provide consent.
        </p>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Why Choose Anoniz for Video Chat?</h2>
          <p className={styles.seoText}>
            Anoniz is the perfect platform for those looking to video chat with strangers online.
            Our anonymous video chat service provides a safe environment where you can meet new
            people face-to-face, make friends, and have meaningful video conversations without
            revealing your identity.
          </p>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Features of Our Video Chat Platform</h2>
          <ul className={styles.seoList}>
            <li>
              <strong>Anonymous Video Chatting:</strong> Video chat with strangers without revealing
              your personal information or identity
            </li>
            <li>
              <strong>Real-Time Video Calls:</strong> Enjoy high-quality video calls with people
              from all over the world
            </li>
            <li>
              <strong>No Registration Required:</strong> Start video chatting immediately without
              creating an account or providing email
            </li>
            <li>
              <strong>Secure Platform:</strong> Your video conversations are private and secure on
              our platform
            </li>
            <li>
              <strong>Easy to Use:</strong> Simple interface that makes it easy to connect and video
              chat with strangers
            </li>
            <li>
              <strong>Global Connections:</strong> Meet people from different countries and cultures
              through video chat
            </li>
          </ul>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>How to Start Video Chat - Age Verification Required</h2>
          <p className={styles.seoText}>
            <strong>18+ Only:</strong> This page requires age verification and consent before you
            can start video chat. Getting started with video chat on Anoniz is simple. To start
            video chat, you must first verify that you are 18 years or older and provide consent by
            checking the age verification box. Once you confirm your age and agree to our terms,
            you&apos;ll be connected with a random stranger for anonymous video chat. You can see
            and hear each other in real-time, making it feel like you&apos;re meeting in person.
            This consent page ensures compliance with age restrictions and user safety.
          </p>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Age Verification and Consent - 18+ Only</h2>
          <p className={styles.seoText}>
            This is an age verification and consent page. Users must be 18 years or older to start
            video chat. Before you can start video chat, you must verify your age and provide
            consent by confirming you are at least 18 years old and agreeing to our Terms of Service
            and Privacy Policy. This age verification process ensures compliance with legal
            requirements and protects minors from accessing adult content.
          </p>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Safe and Anonymous Video Chat</h2>
          <p className={styles.seoText}>
            Your privacy is our priority. When you video chat with strangers on Anoniz, your
            identity remains anonymous. We don&apos;t store your personal information, and you can
            end any video call at any time. Our platform is designed to provide a safe space for
            meaningful face-to-face connections through anonymous video chat. To start video chat,
            complete the age verification and consent process above.
          </p>
        </section>
      </div>
      <ConsentModal isOpen={true} chatType="video" />
    </div>
  );
}
