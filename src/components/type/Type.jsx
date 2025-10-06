import React, {useActionState, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import TypeService from "../../services/type.service";
import Iconify from "../../designComponents/iconify";
import {Button} from "@mui/material";
import {RichTextArea} from "../../designComponents/rich-text-area/index.js";

const Type = () => {

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
  const [slug, setSlug] = useState("");

  useEffect(() => {
    TypeService.getById(id).then(
      (response) => {
        if (response?.data) {
          setTitle(response.data?.title || "");
          setType(response.data?.name || "");
          setMetaTitle(response.data?.metaTitle || "");
          setMetaDescription(response.data?.metaDescription || "");
          setPictureAlt(response.data?.pictureAlt || "");
          setPicture(response.data?.picture || "");
          setTitleBreadcrumb(response.data?.titleBreadcrumb || "");
          setIntro(response.data?.intro || "");
          setEnabled(response.data?.enabled || false);
          setSlug(response.data?.slug || false);


        } else if (id === undefined) {
        }
      },
      (error) => {}
    );

  }, [id]);

  const onChangeMetaTitle = (e) => {
    setMetaTitle(e.target.value);
  };

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeType= (e) => {
    setType(e.target.value);
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

  const navigate = useNavigate();
  const create = () => {
    navigate("/type/create");
  };

  const [state, formAction] = useActionState(handleUpdate, {});

  function handleUpdate (prevState, formData)  {

    setMessage("");
    setLoading(true);
      formData.append("id", id);
      formData.append("name", formData.get("type"));
      //formData.append("picture", formData.get("pictureLink"));

      TypeService.update(id, formData).then((response) => {
        setLoading(false);
        setMessage("Le type " + type + " a été mis à jour !!");
        setTitle(response.data?.title || "");
        setType(response.data?.name || "");
        setMetaTitle(response.data?.metaTitle || "");
        setMetaDescription(response.data?.metaDescription || "");
        setPictureAlt(response.data?.pictureAlt || "");
        setPicture(response.data?.picture || "");
        setTitleBreadcrumb(response.data?.titleBreadcrumb || "");
        setIntro(response.data?.intro || "");
        setEnabled(response.data?.enabled || false);
        setSlug(response.data?.slug || false);
      },
          (error) => {
            setLoading(false);
            setMessage("Il y a eu un problème lors de la mise à jour ...");
          }
      );



  };

  return (
    <>
      <title> {`Front page ${title} | Edition`} </title>
      <h1>{title}</h1>
      <Button variant="contained" onClick={create} startIcon={<Iconify icon="eva:plus-fill" />}>
        New Type
      </Button>
      <form action={formAction} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        <div className="row m-3">
          <div className="col-auto">
            <label htmlFor="type">Name</label>
            <input
                type="text"
                className="form-control"
                name="type"
                value={type}
                onChange={onChangeType}
            />
          </div>
            <div className="col-auto">
              <label htmlFor="title">Titre</label>
              <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={title}
                  onChange={onChangeTitle}
              />
            </div>
          <div className="col-auto">
            <label htmlFor="slug">Slug</label>
            <input
                type="text"
                className="form-control"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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
            <label htmlFor="title">Meta Title</label>
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
                name="pictureFile"
                type="file"
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
          <input className="form-check-input" type="checkbox" id="enabled" name="enabled"checked={enabled}
                 onChange={(e) => onChangeEnabled(e)}/>
          <label className="form-check-label" htmlFor="enabled">Enabled page</label>
        </div>
        <div className="form-group m-3">
          <Button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading && (
                <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Mise à jour</span>
          </Button>
        </div>
      </form>
      {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
      )}
    </>
  );
};

export default Type;
