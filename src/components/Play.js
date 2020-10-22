import React, { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { motion } from 'framer-motion';

import CodeSnippet from './CodeSnippet';
import data from '../data/function-results.json';
import '../styles/play.scss';

// some good old Fisher-Yates with a very hacky recursion to force no item to go back to its original position
const shuffle = arr => {
  let arrCopy = [...arr]

  var i = arr.length, j, temp;
  while(--i > 0){
    j = Math.floor(Math.random()*(i+1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }

  let completelyRandomized = true;
  // in order to be a good exercise, we don't want any of the lines to show up in the same place
  // as the original code snippet, and sometimes after a sort, they can move back to where they started,
  // so if any of them do that, we force a re-shuffle until they're all in a different place from
  // the original
  arr.forEach((element, index) => {
    if (arr[index] === arrCopy[index]) {
      completelyRandomized = false;
    }
  })
  if (completelyRandomized) {
    return arr;
  } else {
    return shuffle(arrCopy);
  }
}

const PAUSE_LENGTH = 1000;
const TYPE = 'functions';

const Play = () => {

  const [difficulty, setDifficulty] = useState('small');

  const snippets = data[TYPE][difficulty];

  const snippetLength = snippets.length;

  const [listIndex, setListIndex] = useState(0)
  const [functionFromList, setFunctionFromList] = useState(snippets[listIndex])
  const [isUpdating, setIsUpdating] = useState(false);
  const [codeOrder, setCodeOrder] = useState(null);

  useEffect(() => {
    const {
      contents: {
        lines,
      },
    } = JSON.parse(functionFromList);
    setCodeOrder(shuffle(lines));
  }, [functionFromList, difficulty])

  useEffect(() => {
    setIsUpdating(false);
    setFunctionFromList(snippets[listIndex])
  }, [listIndex, snippets, difficulty])

  // move back one, unless we're at the beginning, then go to the last item
  const indexToMoveBackTo = () => listIndex <= 0 ? snippetLength - 1 : listIndex - 1;
  // move forward one, unless we're at the end, then go to the first item
  const indexToMoveForwardTo = () => listIndex >= snippetLength - 1 ? 0 : listIndex + 1;

  const handleUpdateDifficulty = (level) => {
    setDifficulty(level);
    setListIndex(0);
    setFunctionFromList(snippets[listIndex]);
  }

  // move back and forward in the code snippets
  const handleArrowClick = (indexFunction) => {
    setIsUpdating(true);
    const {
      contents: {
        lines,
      },
    } = JSON.parse(functionFromList);
    setTimeout(() => {
      setListIndex(indexFunction());
      setCodeOrder(shuffle(lines))
    }, PAUSE_LENGTH);
  }

    const {
      direct_link_to_file_line,
      project_source
    } = JSON.parse(functionFromList);

    // this is ugly, but want to keep the full URLs in the original source
    const justOrgAndProject = project_source
                            .split('/')
                            .slice(-2)
                            .join('/')

  return (
    <Fragment>
      <p className="welcome-text">
        Choose a difficulty level and drag and drop the code lines to re-order them.
      </p>
      <div className="info-wrapper">
        <div className="buttonRow">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`updateDifficulty simple ${difficulty === 'small' ? 'active' : 'inactive'}`}
            onClick={() => handleUpdateDifficulty('small')}
            aria-label="simple functions"
            >
            simple
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`updateDifficulty medium ${difficulty === 'medium' ? 'active' : 'inactive'}`}
            onClick={() => handleUpdateDifficulty('medium')}
            aria-label="medium functions"
            >
            medium
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`updateDifficulty long ${difficulty === 'large' ? 'active' : 'inactive'}`}
            onClick={() => handleUpdateDifficulty('large')}
            aria-label="complex functions"
            >
            complex
          </motion.button>
        </div>
        <div className="item-number">
          {TYPE}: {listIndex + 1}/{snippetLength}
        </div>
        <div className="project-source">
          {justOrgAndProject}
        </div>
        <a className="github-link" href={`${direct_link_to_file_line}`} target="_blank" rel="noopener noreferrer">
          See it on github <FontAwesomeIcon icon={faGithub} />
        </a>
        <div role="button" className="swipe-arrows">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="previous function" className="left-arrow" onClick={() => handleArrowClick(indexToMoveBackTo)}>
            previous
          </motion.button>
          <motion.button  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}aria-label="next function" className="right-arrow" onClick={() => handleArrowClick(indexToMoveForwardTo)}>
            next
          </motion.button>
        </div>
      </div>
      <div className={`code-snippet ${isUpdating ? 'updating' : ''}`} >
        {codeOrder && <CodeSnippet lines={codeOrder} />}
      </div>
    </Fragment>
  )
}

export default Play;