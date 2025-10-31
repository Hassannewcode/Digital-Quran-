import React from 'react';

interface BookmarkIconProps {
    filled: boolean;
}
export const BookmarkIcon: React.FC<BookmarkIconProps> = ({ filled }) => (
    <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}>
        bookmark
    </span>
);

interface NoteIconProps {
    hasNote: boolean;
}
export const NoteIcon: React.FC<NoteIconProps> = ({ hasNote }) => (
     <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${hasNote ? 1 : 0}` }}>
        edit_note
    </span>
);

export const RegenerateIcon: React.FC = () => (
    <span className="material-symbols-outlined">
        sync
    </span>
);

export const LearnIcon: React.FC = () => (
    <span className="material-symbols-outlined">school</span>
);

export const MicrophoneIcon: React.FC = () => (
    <span className="material-symbols-outlined">mic</span>
);