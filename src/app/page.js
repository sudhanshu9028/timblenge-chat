'use client';

import { useState } from 'react';
import ConsentModal from './components/ConsentModal';
import styles from '@/styles/home.module.scss';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatType, setChatType] = useState(null);

  const handleButtonClick = (type) => {
    setChatType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setChatType(null);
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Chat with <span className={styles.gradientStrangers}>Strangers</span>, Make{' '}
          <span className={styles.gradientFriends}>Friends</span> Online!
        </h1>
        <p className={styles.heroSubtitle}>
          Try a random chat alternative to connect with people, find friends, and chat with
          strangers worldwide!!
        </p>
        <div className={styles.heroCTA}>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton} onClick={() => handleButtonClick('text')}>
              Text Chat
            </button>
            <button className={styles.actionButton} onClick={() => handleButtonClick('video')}>
              Video Chat
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Platform Features</h2>
        <div className={styles.featuresGrid}>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Video Chat with Strangers</h3>
            <p className={styles.featureDescription}>
              Connect face-to-face with random people through our secure video chat platform. Start
              a video chat with strangers and make new friends instantly.
            </p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Text Chat</h3>
            <p className={styles.featureDescription}>
              Enjoy real-time text messaging with strangers. Chat anonymously and make meaningful
              connections through our simple and fun text chat interface.
            </p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Safety & Moderation</h3>
            <p className={styles.featureDescription}>
              Our platform prioritizes your safety with built-in moderation tools. Chat with
              strangers in a secure and monitored environment.
            </p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>No Registration Required</h3>
            <p className={styles.featureDescription}>
              Start chatting immediately without creating an account. No email, no sign-up, just
              instant access to chat with strangers online.
            </p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Global Connections</h3>
            <p className={styles.featureDescription}>
              Meet new people from around the world. Our platform connects you with strangers from
              different countries and cultures.
            </p>
          </article>
          <article className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Real-time Messaging</h3>
            <p className={styles.featureDescription}>
              Experience instant messaging with no delays. Our real-time chat technology ensures
              smooth conversations with strangers.
            </p>
          </article>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <h2 className={styles.sectionTitle}>Why Choose Timblenge?</h2>
        <div className={styles.benefitsContent}>
          <article className={styles.benefitItem}>
            <h3 className={styles.benefitTitle}>Anonymous Chat, Meet New People</h3>
            <p className={styles.benefitDescription}>
              Chat anonymously with strangers and meet new people without revealing your identity.
              Our anonymous chat platform allows you to make friends online while maintaining your
              privacy.
            </p>
          </article>
          <article className={styles.benefitItem}>
            <h3 className={styles.benefitTitle}>
              Chat with Random Strangers With Similar Interests
            </h3>
            <p className={styles.benefitDescription}>
              Connect with random strangers who share your interests. Our matching system helps you
              find people to talk to who have similar hobbies and passions.
            </p>
          </article>
          <article className={styles.benefitItem}>
            <h3 className={styles.benefitTitle}>Simple and Fun Video Chats</h3>
            <p className={styles.benefitDescription}>
              Enjoy simple and fun video chats with strangers. No complicated setup required – just
              click and start talking to strangers through video.
            </p>
          </article>
          <article className={styles.benefitItem}>
            <h3 className={styles.benefitTitle}>From Strangers to Friends</h3>
            <p className={styles.benefitDescription}>
              Turn random encounters into lasting friendships. Many users have found their best
              friends through our platform by chatting with strangers online.
            </p>
          </article>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.steps}>
          <article className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Select Your Gender</h3>
            <p className={styles.stepDescription}>
              Choose your gender preference to help us match you with compatible strangers.
            </p>
          </article>
          <article className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Choose Chat Type</h3>
            <p className={styles.stepDescription}>
              Select between video chat or text chat to start your conversation with strangers.
            </p>
          </article>
          <article className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Connect & Chat</h3>
            <p className={styles.stepDescription}>
              Get instantly connected with a random stranger and start making new friends online.
            </p>
          </article>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Talk to Strangers?</h2>
        <p className={styles.ctaDescription}>
          Join thousands of users who are already making new friends and chatting with strangers
          online. Start your journey today!
        </p>
        <div className={styles.ctaButtons}>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton} onClick={() => handleButtonClick('text')}>
              Text Chat
            </button>
            <button className={styles.actionButton} onClick={() => handleButtonClick('video')}>
              Video Chat
            </button>
          </div>
        </div>
      </section>

      <ConsentModal isOpen={isModalOpen} onClose={handleCloseModal} chatType={chatType} />
    </main>
  );
}
