import React, { useEffect } from 'react';
import { firestore, collection, addDoc } from '../config/firestore';

const badgeData = [
  {
    name: 'Newbie Pollster',
    description: 'Awarded when the user creates their first poll.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Create your first poll.',
  },
  {
    name: 'Active Poll Creator',
    description: 'Awarded to users who have created 5 or more polls.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Create 5 or more polls.',
  },
  {
    name: 'Creative Pollmaster',
    description: 'Awarded to users who have created 10 or more polls.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Create 10 or more polls.',
  },
  {
    name: 'Innovative Poll Enthusiast',
    description: 'Awarded to users who have created 20 or more polls.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Create 20 or more polls.',
  },
  {
    name: 'Master Poll Architect',
    description: 'Awarded to users who have created 50 or more polls.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Create 50 or more polls.',
  },
  {
    name: 'First Voter',
    description: 'Awarded when the user votes on their first poll.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Vote on your first poll.',
  },
  {
    name: 'Active Voter',
    description: 'Awarded to users who have voted on 10 or more polls.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Vote on 10 or more polls.',
  },
  {
    name: 'Opinion Shaper',
    description: 'Awarded to users who have voted on 25 or more polls.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Vote on 25 or more polls.',
  },
  {
    name: 'Voice of the People',
    description: 'Awarded to users who have voted on 50 or more polls.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Vote on 50 or more polls.',
  },
  {
    name: 'Ultimate Decision Maker',
    description: 'Awarded to users who have voted on 100 or more polls.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Vote on 100 or more polls.',
  },
  {
    name: 'Popular Poll Creator',
    description: 'Awarded to users whose polls have received a total of 50 or more votes.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Total votes on your polls reach 50 or more.',
  },
  {
    name: 'Influential Pollster',
    description: 'Awarded to users whose polls have received a total of 100 or more votes.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Total votes on your polls reach 100 or more.',
  },
  {
    name: 'Viral Poll Guru',
    description: 'Awarded to users whose polls have received a total of 500 or more votes.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Total votes on your polls reach 500 or more.',
  },
  {
    name: 'Trendsetter Poll Artist',
    description: 'Awarded to users whose polls have received a total of 1000 or more votes.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Total votes on your polls reach 1000 or more.',
  },
  {
    name: 'Global Poll Phenomenon',
    description: 'Awarded to users whose polls have received a total of 5000 or more votes.',
    imageUrl: 'https://example.com/badge-image.png',
    criteria: 'Total votes on your polls reach 5000 or more.',
  },
];

const AddBadges = () => {
  useEffect(() => {
    const addBadgesToFirestore = async () => {
      const badgesCollection = collection(firestore, 'badges');

      try {
        for (const badge of badgeData) {
          await addDoc(badgesCollection, badge);
          console.log(`Added badge: ${badge.name}`);
        }
      } catch (error) {
        console.error('Error adding badges:', error);
      }
    };

    addBadgesToFirestore();
  }, []);

  return (
      <div>
        <h1>Adding Badges to Firestore</h1>
        <p>Check the console for status updates.</p>
      </div>
  );
};

export default AddBadges;
