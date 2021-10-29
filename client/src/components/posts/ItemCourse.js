import { Link } from "react-router-dom";
//-------------------------------------
import Card from "react-bootstrap/Card";
//-------------------------------------
import author from "../../assets/home/author.png";
//-------------------------------------
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

const ItemCourse = ({
  post: { _id, title, description, coursetype },
  user: { name, avatar },
  Posts,
}) => {
  return (
    <>
      <div
        className="feature-course-item-4"
        style={{ width: "30%", display: "inline-flex", marginLeft: "10px" }}
      >
        <div className="fci-details">
          <p className="c-cate">{getTextDisplay(coursetype)}</p>
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
            <img src={checkavatar(avatar)} alt="" />
            <p>{name}</p>
          </div>
          <div className="price-rate">
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
    </>
  );
};

export default ItemCourse;
