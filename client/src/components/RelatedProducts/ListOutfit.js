import React from 'react';
import propTypes from 'prop-types';
import CardOutfit from './CardOutfit';
import style from './css/list.css';

const ListOutfit = ({ productsList, dropHandler }) => (
  <div className={`outfitContainer ${style.yourOwnOutfitList}`}>
    {productsList.map((item) => (
      <div key={item.id.toString()}>
        <CardOutfit item={item} dropHandler={dropHandler} />
      </div>

    ))}
    <div className={`notification ${style.notification}`}>
      <span>
        Add current product
        <br />
        or drag to add related
      </span>
    </div>
  </div>
);

ListOutfit.propTypes = {
  productsList: propTypes.arrayOf(propTypes.object).isRequired,
  dropHandler: propTypes.func.isRequired,
};

export default ListOutfit;
