import React, {useActionState, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {RichTextArea} from "../../designComponents/rich-text-area";
import ArticleService from "../../services/article.service";
import Iconify from "../../designComponents/iconify";
import {z} from "zod";
import {SitemapDate} from "../../designComponents/sitemap-date/index.js";

const Article = () => {

  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [h1Title, setH1Title] = useState("");
  const [dateToSitemap, setDateToSitemap] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [sitemapEnable, setSitemapEnable] = useState(false);
  const [refreshContent, setRefreshContent] = useState(false);
  const [content, setContent] = useState([]);
  const [metaDescription, setMetaDescription] = useState("");
  const [pictureAlt, setPictureAlt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [titleBreadcrumb, setTitleBreadcrumb] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [slug, setSlug] = useState("");
  const [lang, setLang] = useState("");
  const [intro, setIntro] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState([]);
  const [picture, setPicture] = useState();
  const [pictureLink, setPictureLink] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [myTags, setMyTag] = useState(new Map());

  useEffect(() => {
    ArticleService.getById(id).then(
      (response) => {
        if (response?.data) {
          setTitle(response.data?.title || "");
          setType(response.data?.type || "");
          setH1Title(response.data?.h1Title || "");
          setContent(response.data?.content || []);
          setMetaTitle(response.data?.metaTitle || "");
          setMetaDescription(response.data?.metaDescription || "");
          setPictureAlt(response.data?.pictureAlt || "");
          setSlug(response.data?.slug || "");
          setTitleBreadcrumb(response.data?.titleBreadcrumb || "");
          setReadingTime(response.data?.readingTime || "");
          setLang(response.data?.lang || "");
          setIntro(response.data?.intro || "");
          setConclusion(response.data?.conclusion || "");
          setDateToSitemap(response.data?.sitemapDateAdd || "");
          setEnabled(response.data?.enabled || false);
          setSitemapEnable(response.data?.sitemapEnable || false);
          setRefreshContent(response.data?.refreshContent || false);
          setPictureLink(response.data?.picture || "");
          setCreatedAt(response.data?.createdAt || "");
          response.data?.tags?.forEach((tag) => {
            myTags.set(tag.id, true);
          });
          setMyTag(myTags);
        } else if (id === undefined) {
          setContent([{ subContent: [] }]);
        }
      },
      (error) => {}
    );
   /* BlogService.getAllTags().then((res) => {
      if (res?.data) {
        setTags(res.data);
      }
    }); */
  }, [id]);

  const schema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    h1Title: z.string().min(1, "Le main title est requis"),
    lang: z.string().min(1, "La langue est requise"),
    titleBreadcrumb: z.string().min(1, "Le titre du fil d'ariane est requis"),
  });

  const onChangeMetaTitle = (e) => {
    setMetaTitle(e.target.value);
  };

  const onChangeLabel = (e) => {
    setTitle(e.target.value);
  };

  const onChangeH1Title = (e) => {
    setH1Title(e.target.value);
  };

  const onChangePictureAlt = (e) => {
    setPictureAlt(e.target.value);
  };

  const onChangeMetaDescription = (e) => {
    setMetaDescription(e.target.value);
  };

  const onChangeDateToSitemap = (e) => {
    setDateToSitemap(e);
  };

  const onChangeEnabled = (e) => {
    setEnabled(!enabled);
  };

  const onChangeRefreshContent = (e) => {
    setRefreshContent(!refreshContent);
  };

  const onChangeSitemapEnable = (e) => {
    setSitemapEnable(!sitemapEnable);
  };

  const addContentNiv0 = () => {
    setContent((prevContent) => [...prevContent, { subContent: [] }]);
  };

  const addSubContent = (e, position) => {
    e.preventDefault();
    setContent((prevContent) => addRecursif(prevContent, position));
  };

  const addRecursif = (contentArray, tabPos) => {
    if (tabPos.length === 1) {
      let result = contentArray.map((elt, index) => {
        if (index === tabPos[0]) {
          if(!elt.subContent) {
            elt.subContent = [];
          }
          return {
            ...elt,
            subContent: [...elt.subContent, { subContent: [] }],
          };
        }
        return elt;
      });
      if (result.length === 0) {
        result = [{ subContent: [] }];
      }

      return result;
    }

    const pos = tabPos.shift();

    return contentArray.map((elt, index) => {
      if (index === pos) {
        return { ...elt, subContent: addRecursif(elt.subContent, tabPos) };
      }
      return elt;
    });
  };

  const modifyRecursif = (val, contentArray, tabPos, attribute) => {
    if (tabPos.length === 1) {
      return contentArray.map((elt, index) => {
        if (index === tabPos[0]) {
          return {
            ...elt,
            [attribute]: val,
          };
        }
        return elt;
      });
    }

    const pos = tabPos.shift();

    return contentArray.map((elt, index) => {
      if (index === pos) {
        return {
          ...elt,
          subContent: modifyRecursif(val, elt.subContent, tabPos, attribute),
        };
      }
      return elt;
    });
  };

  const changeAttribute = (e, pos, attribute) => {
    e.preventDefault();
    setContent((prevContent) =>
      modifyRecursif(e.target.value, prevContent, pos, attribute)
    );
  };

  const changeAttributeVal = (val, pos, attribute) => {
    setContent((prevContent) =>
      modifyRecursif(val, prevContent, pos, attribute)
    );
  };

  const removeRecursif = (contentArray, tabPos) => {
    if (tabPos.length === 1) {
      return contentArray.filter((elt, index) => index !== tabPos[0]);
    }

    const pos = tabPos.shift();

    return contentArray.map((elt, index) => {
      if (index === pos) {
        return { ...elt, subContent: removeRecursif(elt.subContent, tabPos) };
      }
      return elt;
    });
  };

  const removeSubContent = (pos) => {
    setContent((prevContent) => removeRecursif(prevContent, pos));
  };

  const serializeNestedJsonToFormData = (formData, content, concatFormDataKey = "") => {
    const wayDeb =
      concatFormDataKey === "" ? `content[` : `${concatFormDataKey}`;
    for (let i = 0; i < content.length; i++) {
      const way = `${wayDeb}${i}]`;
      //formData.append(`${way}.title`, content[i].title || "");
      //formData.append(`${way}.text`, content[i].text || "");
      if (content[i].pictureFile) {
        formData.append(
          `${way}.pictureFile`,
          content[i].pictureFile,
          content[i].pictureFile.name
        );
        //formData.append(`${way}.pictureAlt`, content[i].pictureAlt || "");
      }
      if (content[i].pictureLink) {
        //formData.append(`${way}.pictureLink`, content[i].pictureLink);
      }

      if (content[i].subContent?.length > 0) {
        serializeNestedJsonToFormData(
            formData,
          content[i].subContent,
          (concatFormDataKey = `${way}.subContent[`)
        );
      }
    }
  };

  const [state, formAction] = useActionState(handleUpdate, {});

  function handleUpdate (prevState, formData) {

    const title = formData.get("title");
    const h1Title = formData.get("h1Title");
    const lang = formData.get("lang");
    const titleBreadcrumb = formData.get("titleBreadcrumb");

    const parsed = schema.safeParse({ title, h1Title, lang, titleBreadcrumb });

    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }

    setMessage("");
    setLoading(true);
    formData.append("picture", pictureLink);
    try {
      formData.append("sitemapDateAdd", dateToSitemap.format('YYYY-MM-DD'));
    } catch (e) {
      formData.append("sitemapDateAdd", dateToSitemap);
    }

      if (picture) {
        formData.append("picture", picture, picture.name);
      }

      serializeNestedJsonToFormData(formData, content);

      const arrayTags = Array.from(myTags, ([name, value]) => ({
        id: name,
        isCheck: value,
      }));

      for (let i = 0; i < arrayTags.length; i++) {
        if (arrayTags[i].isCheck) {
          formData.append(`tags[${i}].id`, arrayTags[i].id);
        }
      }


      ArticleService.update(id, formData).then(
          (response) => {
            setLoading(false);
            setMessage("Article " + title + " a été modifié");
          },
          (error) => {
            setMessage(error);
          }
      );
  }

  return (
    <>
      <title> {`Front page ${title} | Edition`} </title>
      <h1>{type} - {title}</h1>
      <p>Updated Date : {createdAt}</p>
      <form action={formAction}>
        <div className="form-group m-3">
          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading && (
                <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Mise à jour</span>
          </button>
        </div>
        <div className="row m-3">
          <div className="col-auto">
            <label htmlFor="title">Titre</label>
            <input
                type="text"
                className="form-control"
                name="title"
                value={title}
                onChange={onChangeLabel}
            />
            {state?.errors?.title && (
                <p className="text-red-500 text-sm">{state?.errors?.title}</p>
            )}
          </div>
          <div className="col-auto">
            <label htmlFor="h1Title">Titre H1</label>
            <input
                type="text"
                className="form-control"
                name="h1Title"
                value={h1Title}
                onChange={onChangeH1Title}
            />
            {state?.errors?.h1Title && (
                <p className="text-red-500 text-sm">{state.errors.h1Title}</p>
            )}
          </div>
          <div className="col-auto">
            <label htmlFor="lang">Langue</label>
            <input
                type="text"
                className="form-control"
                name="lang"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
            />
            {state?.errors?.lang && (
                <p className="text-red-500 text-sm">{state.errors.lang}</p>
            )}
          </div>
          <div className="col-auto">
            <label htmlFor="slug">Slug</label>
            <input
                type="text"
                className="form-control"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                readOnly={id}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="readingTime">Reading time</label>
            <input
                type="text"
                className="form-control"
                name="readingTime"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
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
            {state?.errors?.titleBreadcrumb && (
                <p className="text-red-500 text-sm">{state.errors.titleBreadcrumb}</p>
            )}
          </div>
        </div>
        <div className="row m-3">
          <div className="col-auto">
            <div className="form-check form-switch m-3">
              <input className="form-check-input" type="checkbox" id="sitemapEnable" name="sitemapEnable" checked={sitemapEnable}
                     onChange={(e) => onChangeSitemapEnable(e)}/>
              <label className="form-check-label" htmlFor="sitemapEnable">Enable sitemap now</label>
            </div>
            <label htmlFor="dateToSitemap">Date d'ajout au sitemap</label>
            <SitemapDate updateDate={dateToSitemap} onChangeUpdateDate={onChangeDateToSitemap}/>
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
                name="pictureLink"
                value={pictureLink}
                onChange={(e) => setPictureLink(e.target.value)}
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
        <button className="button-blog btn btn-info m-3" onClick={addContentNiv0}>
          + Paragraphe
        </button>
        {content?.map((contentElt, index) => (
            <React.Fragment key={`content-${index}`}>
              <div className={'rounded border border-2 border-success-subtle m-3 p-3'}>
                <div className="niv-1 row">
                  <div className="blog_content_niv-1 col-auto">
                    <h2>Niv 1 - H2</h2>
                  </div>
                  <div style={{cursor: 'pointer', color: '#e40c0c'}} className="blog_content_niv-1 col-auto"
                       onClick={() => removeSubContent([index])} title={'Supprimer le paragraphe'}>
                    <Iconify icon={'eva:close-circle-outline'} sx={{mr: 2}} title={'Supprimer le paragraphe'}/>
                  </div>
                </div>
                <div className="row">
                  <div className={'col-5'}>
                    <label htmlFor={`content[${index}].title`}>Titre du paragraphe</label>
                    <input
                        type="text"
                        className="form-control"
                        name={`content[${index}].title`}
                        value={contentElt?.title}
                        onChange={(e) => changeAttribute(e, [index], "title")}
                    />
                  </div>
                </div>
                <div className="row">
                  <RichTextArea
                      content={contentElt?.text}
                      name={`content[${index}].text`}
                      onChange={(value) => changeAttributeVal(value, [index], "text")}
                  />
                </div>
                <div className="row">
                  <h3>Image du paragraphe</h3>
                  <div className={'col-auto'}>
                    <input
                        className="button-blog"
                        type="file"
                        name={`content[${index}].pictureFile`}
                        onChange={(e) => {
                          changeAttributeVal(e.target.files[0], [index], "pictureFile");
                        }}
                        accept=".jpeg, .JPEG, .jpg, .JPG, .png, .PNG, .webp, .WEBP, .svg, .SVG, .heif, .HEIF, .avif, .AVIF"
                    />
                  </div>
                  <div className={'col-auto'}>
                    <input
                        type="text"
                        className="form-control"
                        name={`content[${index}].pictureLink`}
                        value={contentElt?.pictureLink}
                        onChange={(e) => changeAttribute(e, [index], "pictureLink")}
                        placeholder={'Url de l\'image'}
                    />
                  </div>
                  <div className={'col-auto'}>
                    <input
                        type="text"
                        className="form-control"
                        name={`content[${index}].pictureAlt`}
                        value={contentElt?.pictureAlt}
                        onChange={(e) => changeAttribute(e, [index], "pictureAlt")}
                        placeholder={'Titre de l\'image'}
                    />
                  </div>
                </div>
                {contentElt?.subContent?.length > 0 &&
                    contentElt?.subContent.map((subElt, subIndex) => (
                        <React.Fragment key={`sub-content-niv1-${subIndex}`}>
                          <div className={'rounded border border-2 border-info-subtle m-3 p-3'}>
                            <div className="niv-2 row">
                              <div className="blog_content_niv-2 col-auto">
                                <h3>Niv 2 - H3</h3>
                              </div>
                              <div style={{cursor: 'pointer', color: '#e40c0c'}} className="blog_content_niv-2 col-1"
                                   onClick={() => removeSubContent([index, subIndex])}>
                                <Iconify icon={'eva:close-circle-outline'} sx={{mr: 2}}
                                         title={'Supprimer le paragraphe'}/>
                              </div>
                            </div>
                            <div className="row m-3">
                              <div className={'col-5'}>
                                <label htmlFor={`content[${index}].subContent[${subIndex}].title`}>Titre du paragraphe</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={`content[${index}].subContent[${subIndex}].title`}
                                    value={subElt.title}
                                    onChange={(e) =>
                                        changeAttribute(e, [index, subIndex], "title")
                                    }
                                />
                              </div>
                            </div>
                            <div className="row m-3">
                              <RichTextArea
                                  content={subElt.text}
                                  name={`content[${index}].subContent[${subIndex}].text`}
                                  onChange={(value) =>
                                      changeAttributeVal(value, [index, subIndex], "text")
                                  }
                              />
                            </div>
                            <div>Télécharger une image pour ce paragraphe</div>
                            <input
                                type="file"
                                className="button-blog"
                                name={`content[${index}].subContent[${subIndex}].pictureFile`}
                                onChange={(e) => {
                                  changeAttributeVal(
                                      e.target.files[0],
                                      [index, subIndex],
                                      "pictureFile"
                                  );
                                }}
                                accept=".jpeg, .JPEG, .jpg, .JPG, .png, .PNG, .webp, .WEBP, .svg, .SVG, .heif, .HEIF, .avif, .AVIF"
                            />
                            <input
                                type="text"
                                className="form-control"
                                name={`content[${index}].subContent[${subIndex}].pictureLink`}
                                value={subElt.pictureLink}
                                onChange={(e) =>
                                    changeAttribute(e, [index, subIndex], "pictureLink")
                                }
                                placeholder={'Url de l\'image'}
                            />
                            <label>Titre de l'image</label>
                            <input

                                type="text"
                                className="form-control"
                                name={`content[${index}].subContent[${subIndex}].pictureAlt`}
                                value={subElt.pictureAlt}
                                onChange={(e) =>
                                    changeAttribute(e, [index, subIndex], "pictureAlt")
                                }
                                placeholder={'Titre de l\'image'}
                            />
                            {subElt?.subContent?.length > 0 &&
                                subElt?.subContent.map((subSubElt, subSubIndex) => (
                                    <React.Fragment key={`sub-content-niv2-${subSubIndex}`}>
                                      <div className={'rounded border border-2 border-warning-subtle m-3 p-3'}>
                                        <div className="niv-3">
                                          <div className="blog_content_niv-3">
                                            <h4>Niv 3 - H4</h4>
                                            <div style={{cursor: 'pointer', color: '#e40c0c'}}
                                                 onClick={() => removeSubContent([index, subIndex, subSubIndex])}
                                            >
                                              <Iconify icon={'eva:close-circle-outline'} sx={{mr: 2}}
                                                       title={'Supprimer le paragraphe'}/>
                                            </div>
                                          </div>
                                          <div className="row m-3">
                                            <label htmlFor={`content[${index}].subContent[${subIndex}].subContent[${subSubIndex}].title`}>Titre du
                                              sous paragraphe</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name={`content[${index}].subContent[${subIndex}].subContent[${subSubIndex}].title`}
                                                value={subSubElt.title}
                                                onChange={(e) =>
                                                    changeAttribute(
                                                        e,
                                                        [index, subIndex, subSubIndex],
                                                        "title"
                                                    )
                                                }
                                            />
                                          </div>
                                          <RichTextArea
                                              content={subSubElt.text}
                                              name={`content[${index}].subContent[${subIndex}].subContent[${subSubIndex}].text`}
                                              onChange={(value) =>
                                                  changeAttributeVal(
                                                      value,
                                                      [index, subIndex, subSubIndex],
                                                      "text"
                                                  )
                                              }
                                          />
                                          <div>
                                            Télécharger une image pour ce paragraphe
                                          </div>
                                          <input
                                              type="file"
                                              name={`content[${index}].subContent[${subIndex}].subContent[${subSubIndex}].pictureFile`}
                                              className="button-blog"
                                              onChange={(e) => {
                                                changeAttributeVal(
                                                    e.target.files[0],
                                                    [index, subIndex, subSubIndex],
                                                    "pictureFile"
                                                );
                                              }}
                                              accept=".jpeg, .JPEG, .jpg, .JPG, .png, .PNG, .webp, .WEBP, .svg, .SVG, .heif, .HEIF, .avif, .AVIF"
                                          />
                                          <input
                                              type="text"
                                              className="form-control"
                                              name={`content[${index}].subContent[${subIndex}].subContent[${subSubIndex}].pictureLink`}
                                              value={subSubElt.pictureLink}
                                              onChange={(e) =>
                                                  changeAttribute(
                                                      e,
                                                      [index, subIndex, subSubIndex],
                                                      "pictureLink"
                                                  )
                                              }
                                          />
                                          <label>Titre de l'image</label>
                                          <input
                                              type="text"
                                              className="form-control"
                                              name={`content[${index}].subContent[${subIndex}].subContent[${subSubIndex}].pictureAlt`}
                                              value={subSubElt.pictureAlt}
                                              onChange={(e) =>
                                                  changeAttribute(
                                                      e,
                                                      [index, subIndex, subSubIndex],
                                                      "pictureAlt"
                                                  )
                                              }
                                          />
                                        </div>
                                      </div>
                                    </React.Fragment>
                                ))}
                            <button
                                className="button-blog btn btn-success"
                                onClick={(e) => addSubContent(e, [index, subIndex])}
                            >
                              + Sous paragraphe
                            </button>
                          </div>
                        </React.Fragment>
                    ))}
                <button
                    className="button-blog btn btn-warning"
                    onClick={(e) => addSubContent(e, [index])}
                >
                  + Sous paragraphe
                </button>

              </div>
              {index === content?.length - 1 && (
                  <button className="button-blog btn btn-info m-3" onClick={addContentNiv0}>
                    + Paragraphe
                  </button>
              )}
            </React.Fragment>
        ))}
        <div className="row m-3">
          <div className="col-6">
            <label htmlFor="conclusion">Conclusion</label>
            <input
                type="text"
                className="form-control"
                name="conclusion"
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
            />
          </div>
        </div>
        {tags?.length === 0 && <div className={'m-3'}>Pas de Tags. Contacter l'admin</div>}
        {tags?.length > 0 && (
            <>
              <div className={'m-3'}>Les Tags</div>
              {tags.map((tag, index) => (
                  <div className="bloc_tags_checkbox m-3" key={`tag-${index}`}>
                    <input
                        type="checkbox"
                        name={`tag-${index}`}
                        value={tag.id}
                        onChange={(e) => {
                          myTags.set(tag.id, e.target.checked);
                        }}
                        checked={myTags.has(tag.id)}
                    />
                    <span className="bloc_tags_checkbox-label">{tag.title}</span>
                  </div>
              ))}
            </>
        )}

        <div className="form-check form-switch m-3">
          <input className="form-check-input" type="checkbox" id="enabled" name="enabled" checked={enabled}
                 onChange={(e) => onChangeEnabled(e)}/>
          <label className="form-check-label" htmlFor="enabled">Enabled page</label>
        </div>
        <div className="form-check form-switch m-3">
          <input className="form-check-input" type="checkbox" id="refreshContent" name="refreshContent" checked={refreshContent}
                 onChange={(e) => onChangeRefreshContent(e)}/>
          <label className="form-check-label" htmlFor="refreshContent">Refresh Content from IA</label>
        </div>
        <div className="form-group m-3">
          <button className="btn btn-primary btn-block" disabled={loading} type="submit">
            {loading && (
                <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Mise à jour</span>
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

export default Article;
