'use client';

import ConsentModal from '../components/ConsentModal';
import styles from '@/styles/chatVideoPage.module.scss';

export default function ChatPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.seoContent}>
        <h1 className={styles.seoTitle}>Text Chat with Strangers Online - 18+ Only</h1>
        <p className={styles.seoDescription}>
          <strong>18+ Only - Age Verification Required:</strong> This is a consent and age
          verification page. You must be 18 years or older to start chatting. Experience the best
          anonymous text chat platform where you can chat with strangers from around the world.
          Anoniz offers a secure, real-time messaging experience that connects you with random
          people instantly - no registration or sign-up required. To start chatting, please verify
          your age and provide consent.
        </p>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Why Choose Anoniz for Text Chat?</h2>
          <p className={styles.seoText}>
            Anoniz is the perfect platform for those looking to chat with strangers online. Our
            anonymous text chat service provides a safe environment where you can meet new people,
            make friends, and have meaningful conversations without revealing your identity.
          </p>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Features of Our Text Chat Platform</h2>
          <ul className={styles.seoList}>
            <li>
              <strong>Anonymous Chatting:</strong> Chat with strangers without revealing your
              personal information or identity
            </li>
            <li>
              <strong>Real-Time Messaging:</strong> Enjoy instant messaging with people from all
              over the world
            </li>
            <li>
              <strong>No Registration Required:</strong> Start chatting immediately without creating
              an account or providing email
            </li>
            <li>
              <strong>Secure Platform:</strong> Your conversations are private and secure on our
              platform
            </li>
            <li>
              <strong>Easy to Use:</strong> Simple interface that makes it easy to connect and chat
              with strangers
            </li>
            <li>
              <strong>Global Connections:</strong> Meet people from different countries and cultures
            </li>
          </ul>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>How to Start Chatting - Age Verification Required</h2>
          <p className={styles.seoText}>
            <strong>18+ Only:</strong> This page requires age verification and consent before you
            can start chatting. Getting started with text chat on Anoniz is simple. To start
            chatting, you must first verify that you are 18 years or older and provide consent by
            checking the age verification box. Once you confirm your age and agree to our terms,
            you&apos;ll be connected with a random stranger for anonymous text chat. You can share
            messages, images, and have real-time conversations with people from around the world.
            This consent page ensures compliance with age restrictions and user safety.
          </p>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Age Verification and Consent - 18+ Only</h2>
          <p className={styles.seoText}>
            This is an age verification and consent page. Users must be 18 years or older to start
            chatting. Before you can start chatting, you must verify your age and provide consent by
            confirming you are at least 18 years old and agreeing to our Terms of Service and
            Privacy Policy. This age verification process ensures compliance with legal requirements
            and protects minors from accessing adult content.
          </p>
        </section>

        <section className={styles.seoSection}>
          <h2 className={styles.seoHeading}>Safe and Anonymous Text Chat</h2>
          <p className={styles.seoText}>
            Your privacy is our priority. When you chat with strangers on Anoniz, your identity
            remains anonymous. We don&apos;t store your personal information, and you can end any
            conversation at any time. Our platform is designed to provide a safe space for
            meaningful connections through anonymous text chat. To start chatting, complete the age
            verification and consent process above.
          </p>
        </section>
      </div>
      <ConsentModal isOpen={true} chatType="text" />
    </div>
  );
}
