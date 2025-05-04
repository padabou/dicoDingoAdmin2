import React, {useActionState, useState} from "react";
import ArticleService from "../../services/article.service";

const ArticleCreateByList = () => {

  const [titleList, setTitleList] = useState("[]");
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");

  const onChangeTitleList = (e) => {
    setTitleList(e.target.value);
  };

  const [state, formAction] = useActionState(handleCreate, {});

  function handleCreate (prevState, formData)  {

    setMessage("");
    setLoading(true);

      try {
        const articles = {articles : JSON.parse(titleList)}

        ArticleService.bulkCreate(articles).then(
            (response) => {
              setLoading(false);
              setMessage("Les articles ont bien été initialisés");
              },
            (error) => {
              setLoading(false);
              setMessage(error);
            }
        );
      } catch (e) {
        setMessage("Json invalid, vérifier la synthaxe");
      }
  };

  return (
    <>
      <title> {`Create Bulk Article`} </title>
      <h1>Create bulk article</h1>

      <form action={formAction}>
        <div className="form-group m-3">
          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading && (
                <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Créer</span>
          </button>
        </div>
        <div className="row m-2">
          <div className="col-auto">
            <label
                htmlFor="title">{`Title list formatted as {"title": "mytitle", "type": "existingType"} between bracket`}</label>
            <textarea
                className="form-control"
                name="titleList"
                value={titleList}
                onChange={onChangeTitleList}
                required={true}
                cols={50}
                rows={50}
            />
          </div>
        </div>

        <div className="form-group m-3">
          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading && (
                <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Créer</span>
          </button>
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

export default ArticleCreateByList;
