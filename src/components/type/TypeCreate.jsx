import React, {useActionState, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import TypeService from "../../services/type.service";
import {Button} from "@mui/material";
import {RichTextArea} from "../../designComponents/rich-text-area/index.js";


const TypeCreate = () => {

  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [metaDescription, setMetaDescription] = useState("");
  const [pictureAlt, setPictureAlt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [titleBreadcrumb, setTitleBreadcrumb] = useState("");
  const [intro, setIntro] = useState("");
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");
  const [picture, setPicture] = useState("");
  const navigate = useNavigate();
  const onChangeMetaTitle = (e) => {
    setMetaTitle(e.target.value);
  };

  const onChangePictureAlt = (e) => {
    setPictureAlt(e.target.value);
  };

  const onChangeMetaDescription = (e) => {
    setMetaDescription(e.target.value);
  };

  const onChangeEnabled = (e) => {
    setEnabled(!enabled);
  };

  const [state, formAction] = useActionState(handleCreate, {});

  function handleCreate (prevState, formData) {

    setMessage("");
    setLoading(true);
    formData.append("name", formData.get("type"));

      TypeService.create(formData).then(
          (response) => {
            setLoading(false);
            setMessage("Type " + title + " a été crée");
            navigate(`/type/${response.data.id}`)
          },
          (error) => {
            setLoading(false);
            setMessage(error);
          }
      );
  };

  return (
    <>
      <title> {`Type page | Creation`} </title>
      <h1>Créer un nouveau type</h1>

      <form action={formAction} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        <div className="row m-3">
          <div className="col-auto">
            <label htmlFor="type">Type</label>
            <input
                type="text"
                className="form-control"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
            />

          </div>

          <div className="col-auto">
            <label htmlFor="titleBreadcrumb">Titre Breadcrumb</label>
            <input
                type="text"
                className="form-control"
                name="titleBreadcrumb"
                value={titleBreadcrumb}
                onChange={(e) => setTitleBreadcrumb(e.target.value)}
            />
          </div>
        </div>
        <div className="row m-2">
          <div className="col-auto">
            <label htmlFor="metaTitle">Meta Title</label>
            <textarea
                className="form-control"
                name="metaTitle"
                value={metaTitle}
                onChange={onChangeMetaTitle}
                required={true}
                cols={50}
                rows={10}
                maxLength={256}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="metaDescription">Metadescription</label>
            <textarea
                className="form-control"
                name="metaDescription"
                value={metaDescription}
                onChange={onChangeMetaDescription}
                required={true}
                cols={50}
                rows={10}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="intro">Intro</label>
            <RichTextArea
                content={intro}
                name="intro"
                onChange={(value) => setIntro(value)}
            />
          </div>
        </div>


        <div className="row m-3">
          <h2>Image principale</h2>
          <div className={'col-auto'}>
            <input
                className="button-blog"
                type="file"
                name="pictureFile"
                onChange={(e) => {
                  setPicture(e.target.files[0]);
                }}
                accept=".jpeg, .JPEG, .jpg, .JPG, .png, .PNG, .webp, .WEBP, .svg, .SVG, .heif, .HEIF, .avif, .AVIF"
            />
          </div>
          <div className={'col-auto'}>
            <input
                type="text"
                className="form-control"
                name="picture"
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
                placeholder={'Url de l\'image'}
            />
          </div>
          <div className="col-auto">
            <input
                type="text"
                className="form-control"
                name="pictureAlt"
                value={pictureAlt}
                onChange={onChangePictureAlt}
                placeholder={'Titre de l\'image'}
            />
          </div>
        </div>

        <div className="form-check form-switch m-3">
          <input className="form-check-input" type="checkbox" id="enabled" name="enabled" checked={enabled}
                 onChange={(e) => onChangeEnabled(e)}/>
          <label className="form-check-label" htmlFor="enabled">Enabled page</label>
        </div>
        <div className="form-group m-3">
          <Button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading && (
                <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Créer</span>
          </Button>
        </div>

        {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
        )}
      </form>
    </>
  );
};

export default TypeCreate;
