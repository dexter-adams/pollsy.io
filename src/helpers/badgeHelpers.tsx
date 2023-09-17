import { getDoc, updateDoc, DocumentReference } from 'firebase/firestore';

interface BadgeCriteria {
    badge: string;
    count: number;
}

export const updateBadges = async (
    userDocRef: DocumentReference,
    badgeCriteria: BadgeCriteria[],
    userVotedCount: number
): Promise<void> => {
    const userDocSnapshot = await getDoc(userDocRef);
    const userDocData = userDocSnapshot.data();
    const userBadges: string[] = userDocData?.badges || [];

    const updatedBadges = [...userBadges]; // Create a copy of the array to preserve existing badges

    for (const { badge, count } of badgeCriteria) {
        const hasBadge = userBadges.includes(badge);

        if (userVotedCount >= count && !hasBadge) {
            updatedBadges.push(badge);
        } else if (userVotedCount < count && hasBadge) {
            const badgeIndex = updatedBadges.indexOf(badge);
            updatedBadges.splice(badgeIndex, 1);
        }
    }

    await updateDoc(userDocRef, {
        badges: updatedBadges,
    });
};
