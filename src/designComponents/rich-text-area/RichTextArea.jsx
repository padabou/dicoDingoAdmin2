import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import React from "react"; // Import Sun Editor's CSS File

export default function RichTextArea({ ...props }) {
    const required = (value) => {
        if (!value) {
            return (
                <div className="alert alert-danger" role="alert">
                    This field is required!
                </div>
            );
        }
    };

    const defaultFonts = [
        "Arial",
        "Comic Sans MS",
        "Courier New",
        "Impact",
        "Georgia",
        "Tahoma",
        "Trebuchet MS",
        "Verdana"
    ];
    const sortedFontOptions = [
        "Logical",
        "Salesforce Sans",
        "Garamond",
        "Sans-Serif",
        "Serif",
        "Times New Roman",
        "Helvetica",
        ...defaultFonts
    ].sort();

    return (
        <div>
            <SunEditor key={props?.key} setAllPlugins={true} setContents={props.content} name={props.name}  height="200px" validations={[required]} onChange={props.onChange}
                          setOptions={{
                              buttonList: [
                                  ["undo", "redo"],
                                  ['font', 'fontSize', 'formatBlock'],
                                  ['paragraphStyle', 'blockquote'],
                                  [
                                      "bold",
                                      "underline",
                                      "italic",
                                      "strike",
                                      "subscript",
                                      "superscript"
                                  ],
                                  ["fontColor", "hiliteColor"],
                                  ["align", "list", "lineHeight"],
                                  ["outdent", "indent"],

                                  ["table", "horizontalRule", "link"/*, "image", "video"*/],
                                  // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                  // ['imageGallery'], // You must add the "imageGalleryUrl".
                                  // ["fullScreen", "showBlocks", "codeView"],
                                  ["preview"/*, "print"*/],
                                  ["removeFormat"]

                                  // ['save', 'template'],
                                  // '/', Line break
                              ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                              defaultTag: "div",
                              minHeight: "300px",
                              showPathLabel: false,
                              font: sortedFontOptions
                          }}
        />
        </div>
    );
}