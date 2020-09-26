import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

import CodeSnippet from './CodeSnippet';
import data from '../data/function-results.json';
import '../styles/play.scss';




const PAUSE_LENGTH = 1000;

const Play = (props) => {

  // used to grab the "type" from the path...this seemed cleaner than having a bunch of different Route components in index.js
  const { type } = props.match.params;
  const snippets = data[type];

  const snippetLength = snippets.length;

  const [listIndex, setListIndex] = useState(0)
  const [list, setList] = useState(snippets[listIndex])
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsUpdating(false);
    setList(snippets[listIndex])
  }, [listIndex, snippets])
  // move back one, unless we're at the beginning, then go to the last item
  const indexToMoveBackTo = () => listIndex <= 0 ? snippetLength - 1 : listIndex - 1;
  // move forward one, unless we're at the end, then go to the first item
  const indexToMoveForwardTo = () => listIndex >= snippetLength - 1 ? 0 : listIndex + 1;

  // move back and forward in the code snippets
  const handleArrowClick = (indexFunction) => {
    setIsUpdating(true);
    const indexToMoveTo = indexFunction();
    setTimeout(() => setListIndex(indexToMoveTo), PAUSE_LENGTH);
  }

  const {
    contents: {
      lines,
    },
    direct_link_to_file_line,
    project_source
  } = JSON.parse(list);

  return (
    <Fragment>
      <div className="home-screen" >
        <Link to={"/"}>go back home</Link>
      </div>
      <div className="info-wrapper">
        <div className="item-number">
          {type.toUpperCase()}: {listIndex + 1}/{snippetLength}
        </div>
        <div className="project-source">
          {project_source}
        </div>
        <a className="github-link" href={`${direct_link_to_file_line}`} target="_blank" rel="noopener noreferrer">
          See it on github <FontAwesomeIcon icon={faGithub} />
        </a>
        <div role="button" aria-label="public or private" className="swipe-arrows">
          <div className="left-arrow" onClick={() => handleArrowClick(indexToMoveBackTo)}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <div className="right-arrow" onClick={() => handleArrowClick(indexToMoveForwardTo)}>
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </div>
      <div className={`code-snippet ${isUpdating ? 'updating' : ''}`} >
        <CodeSnippet lines={lines} />
      </div>
    </Fragment>
  )
}

export default Play;