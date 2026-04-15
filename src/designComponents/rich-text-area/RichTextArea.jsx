import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";

// Import du style obligatoire
import "quill/dist/quill.snow.css";

export default function RichTextArea({ content, onChange, name, ...props }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const [isEmpty, setIsEmpty] = useState(false);

    // Ta logique de validation "required" adaptée
    const checkRequired = (htmlContent) => {
        // Quill génère souvent "<p><br></p>" quand il est vide
        const isActuallyEmpty = !htmlContent || htmlContent === "<p><br></p>";
        setIsEmpty(isActuallyEmpty);
    };

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            // Configuration de la barre d'outils (mapping de ta buttonList SunEditor)
            const toolbarOptions = [
                ['undo', 'redo'], // Nécessite une petite config CSS/JS pour les icônes si tu les veux vraiment
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }, { 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'blockquote', 'code-block'],
                ['clean'] // Le "removeFormat"
            ];

            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                modules: {
                    toolbar: toolbarOptions,
                    history: { delay: 1000, maxStack: 100, userOnly: true }
                },
                placeholder: 'Écrivez ici...',
            });

            // Injection du contenu initial
            if (content) {
                quillRef.current.root.innerHTML = content;
            }

            // Listener de changement
            quillRef.current.on('text-change', () => {
                const html = quillRef.current.root.innerHTML;
                if (onChange) {
                    onChange(html); // On renvoie le HTML à ton parent
                }
                checkRequired(html);
            });
        }
    }, []);

    // Mise à jour si le contenu change via les props (ex: reset du formulaire)
    useEffect(() => {
        if (quillRef.current && content !== quillRef.current.root.innerHTML) {
            quillRef.current.root.innerHTML = content || "";
        }
    }, [content]);

    return (
        <div className="mb-3">
            <div className="quill-wrapper bg-white">
                <div ref={editorRef} style={{ minHeight: "300px" }} />
            </div>

            {/* Affichage de ta validation required */}
            {isEmpty && (
                <div className="alert alert-danger mt-2" role="alert">
                    Ce champ est requis !
                </div>
            )}

            {/* Input caché pour conserver la compatibilité avec les formulaires classiques si besoin */}
            <input type="hidden" name={name} value={content} />
        </div>
    );
}