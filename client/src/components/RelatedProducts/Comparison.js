import React from 'react';
import propTypes from 'prop-types';
import style from './css/comparison.css';

const Results = ({ feature, currentValue, clickedValue }) => (
  <tr className={style.row}>
    <td className={style.currentValue}>{currentValue}</td>
    <td className={style.feature}>{feature}</td>
    <td className={style.clickedValue}>{clickedValue}</td>
  </tr>
);

const Comparison = ({ current, clicked, closeCompare }) => {
  const currentFeatures = {};
  for (let i = 0; i < current.features.length; i += 1) {
    currentFeatures[current.features[i].feature] = current.features[i].value;
  }
  const clickedFeatures = {};
  for (let i = 0; i < clicked.features.length; i += 1) {
    clickedFeatures[clicked.features[i].feature] = clicked.features[i].value;
  }

  const featureChecker = (feature, features) => {
    if (feature in features) {
      return features[feature] || '✓';
    }
    return '';
  };

  const compareCurrentFeature = Object.keys(currentFeatures).map((item) => <Results key={item} feature={item} currentValue={currentFeatures[item] || '✓'} clickedValue={featureChecker(item, clickedFeatures)} />);
  const compareClickedFeature = Object.keys(clickedFeatures).map((item) => {
    if (currentFeatures[item] === undefined) {
      return <Results key={item} feature={item} currentValue={featureChecker(item, currentFeatures)} clickedValue={clickedFeatures[item] || '✓'} />;
    } return undefined;
  });

  return (
    <div>
      <div className={style.blocker} onClick={closeCompare} onKeyPress={closeCompare} role="button" tabIndex={0} aria-label="Mute volume" />
      <div className={style.comparison}>
        <div className={style.compareTitle}>comparison</div>
        <i className={`${style.close} fa fa-times`} onClick={closeCompare} onKeyPress={closeCompare} role="button" tabIndex={0} aria-label="Mute volume" />
        <table className={style.comparisonTable}>
          <tbody>
            <tr>
              <td className={style.titleRow}>{current.name}</td>
              <td className={style.titleRow}>features</td>
              <td className={style.titleRow}>{clicked.name}</td>
            </tr>
            {compareCurrentFeature}
            {compareClickedFeature}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Results.propTypes = {
  feature: propTypes.string.isRequired,
  currentValue: propTypes.string.isRequired,
  clickedValue: propTypes.string.isRequired,
};

Comparison.propTypes = {
  current: propTypes.shape({
    name: propTypes.string.isRequired,
    id: propTypes.number.isRequired,
    features: propTypes.arrayOf(propTypes.object).isRequired,
  }).isRequired,
  clicked: propTypes.shape({
    name: propTypes.string.isRequired,
    id: propTypes.number.isRequired,
    features: propTypes.arrayOf(propTypes.object).isRequired,
  }).isRequired,
  closeCompare: propTypes.func.isRequired,
};

export default Comparison;
