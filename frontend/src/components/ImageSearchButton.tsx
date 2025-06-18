// 'use client';

// type ImageSearchButtonProps = {
//   onClick: () => void;
  
// };

// export default function ImageSearchButton({ onClick }: ImageSearchButtonProps) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className="mt-4 bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-full block mx-auto"
//     >
//       Search with this image
//     </button>
//   );
// }

'use client';

type ImageSearchButtonProps = {
  onClick: () => void;
  onCancel?: () => void;
};

export default function ImageSearchButton({ onClick, onCancel }: ImageSearchButtonProps) {
  return (
    <div className="mt-4 flex justify-center gap-4">
      <button
        type="button"
        onClick={onClick}
        className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
      >
        Search with this image
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-red-500 hover:bg-gray-200 px-6 py-2 rounded-full"
        >
          Cancel
        </button>
      )}
    </div>
  );
}