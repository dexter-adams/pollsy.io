// import { firestore } from '../config/firestore';
//
// export const instantiateDatabase = (user) => {
//   if (user) {
//     // Check if the setup data is already cached
//     const cachedSetupData = localStorage.getItem(`setup_${user.uid}`);
//
//     if (cachedSetupData) {
//       // Use the cached data instead of making Firestore calls
//       const parsedData = JSON.parse(cachedSetupData);
//       // Use parsedData for your app logic
//     } else {
//       // Reference to the user's document
//       const userDocRef = firestore.collection('users').doc(user.uid);
//
//       // Check if the user document exists
//       userDocRef.get().then((doc) => {
//         if (!doc.exists) {
//           // If the user document doesn't exist, create it
//           userDocRef.set({
//             // Your user-specific data here
//           });
//         }
//
//         // Check for the 'polls' collection
//         const pollsCollectionRef = userDocRef.collection('polls');
//         pollsCollectionRef.get().then((snapshot) => {
//           if (snapshot.empty) {
//             // If the 'polls' collection doesn't exist, create it
//             // You can add documents to this collection as needed
//           }
//
//           // Cache the setup data
//           const setupDataToCache = {
//             // Include any relevant data you want to cache
//           };
//           localStorage.setItem(`setup_${user.uid}`, JSON.stringify(setupDataToCache));
//
//           // Continue with your app logic
//         });
//       });
//     }
//   }
// };
//
