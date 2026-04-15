import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function RichTextArea({ content, onChange, name }) {

    const handleEditorChange = (newContent) => {
        if (onChange) {
            onChange(newContent);
        }
    };

    return (
        <div className="mb-3">
            <Editor
                // Pour éviter de créer un compte cloud, on peut utiliser un CDN public
                // ou l'installer en local (ici via CDN pour aller vite)
                tinymceScriptSrc="https://cdn.tiny.cloud/1/qtit0r50u6i26jjlkz4ceahj35l41qpfuylikwp6biz1g0of/tinymce/7/tinymce.min.js"
                value={content}
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    // C'est ici que TinyMCE devient ton ami :
                    extended_valid_elements: 'div[*]', // Autorise TOUTES les div avec n'importe quels attributs
                    valid_children: '+body[div]',      // Autorise les div à la racine
                }}
                onEditorChange={handleEditorChange}
            />

            {/* Input caché pour tes formulaires existants */}
            <input type="hidden" name={name} value={content} />
        </div>
    );
}