import { Link } from "react-router-dom";
//--------------------------------------------------------
import Card from "react-bootstrap/Card";
//--------------------------------------------------------
import author from "../../assets/home/author.png";
import { formatDate } from "../../utils/FormatDate";
import { getTextDisplay } from "../../utils/GettextDisplay";

const removeHTML = (str) => {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = str;
  return tmp.textContent || tmp.innerText || "";
};

const checkavatar = (str) => {
  str = str ? str : author;
  return str;
};

const createsreach = (id) => {
  return "?id=" + id;
};

const CardPost = ({
  post: { _id, title, description, coursetype, thumbnail, createdAt },
  user: { id, username, name, avatar },
  Posts,
}) => {
  return (
    <>
      <div className="col-lg-4 col-md-6 shaf-item">
        <div id={_id} className="feature-course-item">
          <div className="flipper">
            <div className="front">
              <div className="fcf-thumb">
                <img src={thumbnail} alt="" />
              </div>
              <h4>{title}</h4>
              <div className="fcf-bottom">
                <p>{getTextDisplay(coursetype)}</p>
                <p>{formatDate(createdAt)}</p>
              </div>
            </div>
            <div className="back">
              <div className="fcf-thumb">
                <img src={thumbnail} alt="" />
              </div>
              <h4>
                <Link
                  to={{
                    pathname: "/coursedetail/",
                    search: createsreach(_id),
                    state: Posts,
                  }}
                >
                  {title}
                </Link>
              </h4>
              <div className="author">
                <img src={checkavatar(avatar)} alt={username} />
                <p
                  id={id}
                  style={{
                    display: "inline",
                    marginLeft: "5px",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}
                >
                  {name}
                </p>
              </div>
              <Card.Text>
                <div
                  style={{
                    maxHeight: "100px",
                    overflow: "hidden",
                    textAlign: "justify",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 4,
                    display: "-webkit-box",
                  }}
                >
                  {removeHTML(description)}
                </div>
              </Card.Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardPost;
