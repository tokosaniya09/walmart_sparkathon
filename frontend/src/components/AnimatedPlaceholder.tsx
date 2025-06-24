'use client';
import { useEffect, useRef } from 'react';

const phrases = [
  'Search for a white top to match with red skirt',
  'Shirt with blue lines',
  'Frill skirt in baby pink color',
  'Cotton kurti under ₹500',
  'Oversized t-shirt in pastel shades',
  'Black heels for evening party',
  'Gold-plated jewellery for festive wear',
  'Wireless earbuds with mic',
  'Trendy bucket hat for summer',
  'Leather boots for winter',
  'Gym shorts for men under ₹800',
  'Floral bedsheets in king size',
  'Bluetooth speaker for home',
  'Sunglasses for oval face shape',
  'Crop top with puff sleeves',
  'Handbag to match ethnic outfits',
  'Cozy hoodie for late-night strolls',
  'Pastel bedsheet with matching pillow covers',
  'Minimalist desk lamp for study table',
  'Sneakers to pair with joggers',
  'Denim jeans for casual outing',
  'Formal blazer for office wear',
  'Printed saree in georgette fabric',
  'Canvas tote bag for college',
  'Anti-glare specs for long screen time',
];

type Props = {
  isActive: boolean;
  onChange: (text: string) => void;
  resetSignal: boolean;
};

export default function AnimatedPlaceholder({ isActive, onChange, resetSignal }: Props) {
  const phraseIndex = useRef(Math.floor(Math.random() * phrases.length));
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  if (resetSignal) {
    // reset everything
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    phraseIndex.current = Math.floor(Math.random() * phrases.length);
    charIndex.current = 0;
    isDeleting.current = false;
    onChange('');
  }
}, [resetSignal]);

  useEffect(() => {
    if (!isActive) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const tick = () => {
      const currentPhrase = phrases[phraseIndex.current];
      const currentText = currentPhrase.slice(0, charIndex.current);

      onChange(currentText);

      if (!isDeleting.current) {
        // Typing phase
        if (charIndex.current < currentPhrase.length) {
          charIndex.current++;
          timeoutRef.current = setTimeout(tick, 100); // typing speed
        } else {
          // Wait after full sentence
          timeoutRef.current = setTimeout(() => {
            isDeleting.current = true;
            tick(); // start deleting
          }, 1500); // WAIT 2s before deleting
        }
      } else {
        // Deleting phase
        if (charIndex.current > 0) {
          charIndex.current--;
          timeoutRef.current = setTimeout(tick, 50); // deleting speed
        } else {
          // Move to next phrase
          isDeleting.current = false;
          phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
          timeoutRef.current = setTimeout(tick, 1000); // wait before typing next
        }
      }
    };

    tick(); // start the loop

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, onChange]);

  return null;
}
