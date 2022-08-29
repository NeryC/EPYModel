import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders, faCameraAlt } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import MultiRangeSlider from './MultiRangeSlider';
import Tooltip from './Tooltip';
import ToogleButton from './ToogleButton';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSettings,
  setChecks,
  resetChecks,
  setRange
} from '../../store/reducers/graphInfoSlice';
import * as d3 from 'd3';
import { saveAs } from 'file-saver';

const SettingsDropDown = ({ type, data }) => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings(type));

  const [dropdown, setDropdown] = useState(false);

  const handleChangeChecks = (checkName) => {
    dispatch(
      setChecks({
        type,
        checkName
      })
    );
  };

  const resetSettings = () => {
    dispatch(
      resetChecks({
        type
      })
    );
  };

  const handleChangeRange = (min, max) => {
    if (settings.range.start !== min || settings.range.finish !== max)
      dispatch(
        setRange({
          type,
          start: min,
          finish: max
        })
      );
  };

  const isExpanded = () => {
    return dropdown ? 'block' : 'hidden';
  };

  const downloadGraph = () => {
    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(d3.select(`#${type}`).node());
    const imgData =
      'data:image/svg+xml;base64,' + Buffer.from(xmlString).toString('base64');
    saveAs(imgData, `${type}.svg`);
  };

  if (settings)
    return (
      <div
        className="flex flex-col items-end top-10 right-10 absolute"
        onMouseLeave={() => setDropdown(false)}
      >
        <div
          onClick={() => setDropdown(!dropdown)}
          className="p-3 shadow-2xl mb-2 rounded-full shadow-gray-900 inline-flex text-sm border text-gray-600 
        hover:bg-gray-600 hover:text-white bg-white"
        >
          <FontAwesomeIcon icon={faSliders} />
        </div>

        <div
          className={`${isExpanded()} shadow  border bg-white z-40 rounded flex flex-col p-2 items-center text-sm`}
        >
          <div className="border-b mb-3 w-full flex justify-between font-bold text-base">
            Chart Settings
            <Tooltip text={'Download Graph'}>
              <button onClick={() => downloadGraph()}>
                <FontAwesomeIcon icon={faCameraAlt} />
              </button>
            </Tooltip>
          </div>

          <ToogleButton
            label="Smoothed data"
            name="isSmooth"
            handleChange={() => handleChangeChecks('isSmooth')}
            checkedState={settings.isSmooth}
          />

          <div className="flex justify-between mb-5">
            <span className="text-gray-900 mr-3 flex-none">Date range</span>
            <MultiRangeSlider
              min={0}
              max={settings.dataLength}
              selectedMin={settings.range.start}
              selectedMax={settings.range.finish}
              data={data}
              onChange={({ min, max }) => handleChangeRange(min, max)}
            />
          </div>

          <ToogleButton
            label="Uncertainty"
            name="uncertainty"
            handleChange={() => handleChangeChecks('uncertainty')}
            checkedState={settings.uncertainty}
          />

          <div className="border-b mb-3 w-full" />

          <div className="flex justify-between w-full mb-2 text-sm">
            <button className="bg-transparent hover:bg-indigo-600 text-indigo-600 font-semibold hover:text-white px-2 border border-indigo-600 hover:border-transparent rounded">
              Apply to all
            </button>
            <button
              onClick={() => resetSettings()}
              className="bg-transparent hover:bg-indigo-600 text-indigo-600 font-semibold hover:text-white px-2 border border-indigo-600 hover:border-transparent rounded"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
};

export default SettingsDropDown;
