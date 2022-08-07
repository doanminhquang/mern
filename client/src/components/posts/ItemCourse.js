import { Link } from "react-router-dom";
//-------------------------------------
import author from "../../assets/home/author.png";
//-------------------------------------
import { AiFillTag } from "react-icons/ai";
import { AiFillStar } from "react-icons/ai";
//-------------------------------------
import { getCurrencyVnd } from "../../utils/GettextDisplay";

const checkavatar = (str) => {
  str = str ? str : author;
  return str;
};

const createsreach = (id) => {
  return "?id=" + id;
};

const ItemCourse = ({
  post: { _id, title, category, thumbnail, countrating, avgrating, price },
  user,
  Posts,
}) => {
  return (
    <>
      <div className="col-lg-4 col-md-6">
        <div className="feature-course-item-4">
          <Link
            to={{
              pathname: "/coursedetail/",
              search: createsreach(_id),
              state: Posts,
            }}
            style={{ color: "black" }}
          >
            <div className="fcf-thumb">
              <img src={thumbnail} alt="thumbnail" />
            </div>
          </Link>
          <div className="fci-details">
            <AiFillTag />
            {category.name}
            <h4>
              <Link
                to={{
                  pathname: "/coursedetail/",
                  search: createsreach(_id),
                }}
                style={{ color: "black" }}
              >
                {title}
              </Link>
            </h4>
            <div className="author">
              <img src={checkavatar(user.avatar)} alt={user.name} />
              <Link
                to={{
                  pathname: "/profile/",
                  search: createsreach(user._id),
                }}
                style={{ color: "black" }}
              >
                {user.name}
              </Link>
            </div>
            <div className="price-rate">
              {getCurrencyVnd(price)}
              <div className="ratings">
                <AiFillStar color="yellow" />
                <span>
                  {avgrating} ({countrating})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemCourse;
