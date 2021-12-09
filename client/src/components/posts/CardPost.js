import { Link } from "react-router-dom";
//--------------------------------------------------------
import Card from "react-bootstrap/Card";
//--------------------------------------------------------
import author from "../../assets/home/author.png";
import { formatDate } from "../../utils/FormatDate";
import { getTextDisplay } from "../../utils/GettextDisplay";
import Star from "../layout/Star";
//-----------------------------------------------------

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
  post: {
    _id,
    title,
    description,
    coursetype,
    thumbnail,
    createdAt,
    countrating,
    avgrating,
  },
  user,
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
                  style={{ color: "white" }}
                >
                  {title}
                </Link>
              </h4>
              <div className="ratings">
                <Star rating={avgrating} />
                <span style={{ paddingBottom: 6, paddingTop: 10 }}>
                  {avgrating} ({countrating})
                </span>
              </div>
              <div className="author">
                <img src={checkavatar(user.avatar)} alt={user.username} />
                <p
                  style={{
                    display: "inline",
                    marginLeft: "5px",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}
                >
                  <Link
                    to={{
                      pathname: "/profile/",
                      search: createsreach(user._id),
                    }}
                    style={{ color: "white" }}
                  >
                    {user.name}
                  </Link>
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
                    color: "white",
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
