import React from "react";

export default function Star(props) {
  const rating = props.rating;
  const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const index = props.index;
  var number = rating;
  var a = parseInt(number);
  number -= a;
  if (number < 0.5) number = a;
  else number = a + 0.5;
  const name = `rating_${index}_${uid}`;
  return (
    <div id="rating">
      <input
        type="radio"
        id="star5"
        name={name}
        value="5"
        checked={number === 5}
        onChange={{}}
      />
      <label
        className="full"
        for="star5"
        title="Tuyệt vời - 5 sao"
        disabled
      ></label>

      <input
        type="radio"
        id="star4half"
        name={name}
        value="4.5"
        checked={number === 4.5}
        onChange={{}}
      />
      <label
        className="half"
        for="star4half"
        title="Khá tốt - 4.5 sao"
        disabled
      ></label>

      <input
        type="radio"
        id="star4"
        name={name}
        value="4"
        checked={number === 4}
        onChange={{}}
      />
      <label
        className="full"
        for="star4"
        title="Khá tốt - 4 sao"
        disabled
      ></label>

      <input
        type="radio"
        id="star3half"
        name={name}
        value="3.5"
        checked={number === 3.5}
        onChange={{}}
      />
      <label
        className="half"
        for="star3half"
        title="Cố gắng lên - 3.5 sao"
        disabled
      ></label>

      <input
        type="radio"
        id="star3"
        name={name}
        value="3"
        checked={number === 3}
        onChange={{}}
      />
      <label
        className="full"
        for="star3"
        title="Cố gắng lên - 3 sao"
        disabled
      ></label>

      <input
        type="radio"
        id="star2half"
        name={name}
        value="2.5"
        checked={number === 2.5}
        onChange={{}}
      />
      <label
        className="half"
        for="star2half"
        title="Khá là kém - 2.5 sao"
        disabled
      ></label>

      <input
        type="radio"
        id="star2"
        name={name}
        value="2"
        checked={number === 2}
        onChange={{}}
      />
      <label
        className="full"
        for="star2"
        title="Khá là kém - 2 sao"
        disabled
      ></label>

      <input
        type="radio"
        id="star1half"
        name={name}
        value="1.5"
        checked={number === 1.5}
        onChange={{}}
      />
      <label
        className="half"
        for="star1half"
        title="Buồn thật - 1.5 sao"
        disabled
      ></label>

      <input
        type="radio"
        id="star1"
        name={name}
        value="1"
        checked={number === 1}
        onChange={{}}
      />
      <label
        className="full"
        for="star1"
        title="Rất tệ hại - 1 sao"
        disabled
      ></label>

      <input
        type="radio"
        id="starhalf"
        name={name}
        value="0.5"
        checked={number === 0.5}
        onChange={{}}
      />
      <label
        className="half"
        for="starhalf"
        title="Rất tệ hại - 0.5 stars"
        disabled
      ></label>
    </div>
  );
}
