import React, { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

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

  const snippets = data[TYPE];

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
  }, [functionFromList])

  useEffect(() => {
    setIsUpdating(false);
    setFunctionFromList(snippets[listIndex])
  }, [listIndex, snippets])

  // move back one, unless we're at the beginning, then go to the last item
  const indexToMoveBackTo = () => listIndex <= 0 ? snippetLength - 1 : listIndex - 1;
  // move forward one, unless we're at the end, then go to the first item
  const indexToMoveForwardTo = () => listIndex >= snippetLength - 1 ? 0 : listIndex + 1;

  // move back and forward in the code snippets
  const handleArrowClick = (indexFunction) => {
    setIsUpdating(true);
    const indexToMoveTo = indexFunction();
    const {
      contents: {
        lines,
      },
    } = JSON.parse(functionFromList);
    setTimeout(() => {
      setListIndex(indexToMoveTo);
      setCodeOrder(shuffle(lines))
    }, PAUSE_LENGTH);
  }

    const {
      direct_link_to_file_line,
      project_source
    } = JSON.parse(functionFromList);

  return (
    <Fragment>
        <p className="welcome-text">
                welcome to the examples! Choose a code type to see examples from real github projects.
                Click on the github link to go directly to the line in the original source code.

                You can drag and drop the code lines to re-order them.
              </p>
        <div className="info-wrapper">
        <div className="item-number">
          {TYPE}: {listIndex + 1}/{snippetLength}
        </div>
        <div className="project-source">
          {project_source}
        </div>
        <a className="github-link" href={`${direct_link_to_file_line}`} target="_blank" rel="noopener noreferrer">
          See it on github <FontAwesomeIcon icon={faGithub} />
        </a>
        <div role="button" className="swipe-arrows">
          <div className="left-arrow" onClick={() => handleArrowClick(indexToMoveBackTo)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <div className="right-arrow" onClick={() => handleArrowClick(indexToMoveForwardTo)}>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </div>
      <div className={`code-snippet ${isUpdating ? 'updating' : ''}`} >
        {codeOrder && <CodeSnippet lines={codeOrder} />}
      </div>
    </Fragment>
  )
}

export default Play;