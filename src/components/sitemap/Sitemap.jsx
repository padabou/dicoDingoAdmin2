import React, {useActionState, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import SitemapService from "../../services/sitemap.service";
import {SitemapDate} from "../../designComponents/sitemap-date/index.js";

const Sitemap = () => {
  const { id } = useParams();

  const [loc, setLoc] = useState("");
  const [type, setType] = useState("");
  const [articleId, setArticleId] = useState("");
  const [updateDate, setUpdateDate] = useState(new Date());
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if(id) {
      SitemapService.getById(id).then((res) => {
        if (res?.data) {
          setArticleId(res?.data?.articleId);
          setUpdateDate(res?.data?.lastmod);
          setLoc(res?.data?.loc);
          setEnabled(res?.data?.enabled);
          setType(res?.data?.type);
        }
      });
    }
  }, [id]);
  const navigate = useNavigate();

  const onChangeUpdateDate = (e) => {
    setUpdateDate(e);
  };

  const onChangeEnabled = (e) => {
    setEnabled(!enabled);
  };
  const onChangeLoc = (e) => {
    setLoc(e.target.value);
  };
  const onChangeArticleId = (e) => {
    setArticleId(e.target.value);
  };
  const onChangeType = (e) => {
    setType(e.target.value);
  };

  const [state, formAction] = useActionState(handleCreate, {});

  function handleCreate (prevState, formData) {

    setMessage("");
    setLoading(true);
    try {
      formData.append("lastmod", updateDate.format('YYYY-MM-DD'));
    } catch (e) {
      formData.append("lastmod", updateDate);
    }

    if (id === undefined) {
      SitemapService.create(formData).then(
          (response) => {
            setLoading(false);
            setMessage("Sitemap " + loc + " a été crée");
            navigate(`/sitemap/${response.data.id}`)
          },
          (error) => {
            setMessage(error);
          }
      );
    } else {
      SitemapService.update(id, formData).then(
          (response) => {
            setLoading(false);
            setMessage("Sitemap " + loc + " a été modifié");
          },
          (error) => {
            setMessage(error);
          }
      );

    }

  };

  return (
    <>
      <title> {`Front page ${loc} | Edition`} </title>
      <h1>{loc ? loc : 'Création d\'une entrée dans le sitemap'}</h1>

      <form action={formAction} onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}>
        <div className="row m-3">

          <div className="col-auto">
            <label htmlFor="loc">Loc</label>
            <input
                type="text"
                className="form-control"
                name="loc"
                value={loc}
                onChange={onChangeLoc}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="articleId">ArticleId</label>
            <input
                type="text"
                className="form-control"
                name="articleId"
                value={articleId}
                onChange={onChangeArticleId}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="type">Type</label>
            <input
                type="text"
                className="form-control"
                name="Type"
                value={type}
                onChange={onChangeType}
            />
          </div>

        <div className="row m-3">
          <div className="col-auto">
            <label htmlFor="dateToSitemap">Date d'ajout au sitemap</label>
            <SitemapDate updateDate={updateDate} onChangeUpdateDate={onChangeUpdateDate}/>
          </div>
        </div>
        <div className="form-check form-switch m-3">
          <input className="form-check-input" type="checkbox" id="enabled" name="enabled" checked={enabled}
                 onChange={(e) => onChangeEnabled(e)}/>
          <label className="form-check-label" htmlFor="enabled">Activer</label>
        </div>
        <div className="form-group m-3">
          <button className="btn btn-primary btn-block" disabled={loading}>
            {loading && (
                <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Créer</span>
          </button>
        </div>
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

export default Sitemap;
