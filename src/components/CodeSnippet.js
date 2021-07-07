import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { DragDropContext, Draggable, Droppable  } from 'react-beautiful-dnd';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging && "lightgreen",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
});

const CodeSnippet = ({ lines }) => {

   useEffect(() =>{
     setCodeOrder(lines);
   }, [lines]);

    const [codeOrder, setCodeOrder] = useState(lines);

    const onDragEnd = (result) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      const items = reorder(
        codeOrder,
        result.source.index,
        result.destination.index
      );

      setCodeOrder(items);
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <pre
                      className="code-content"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {codeOrder.map((item, index) => (
                        <Draggable key={item.line_number.toString()} draggableId={item.line_number.toString()} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className={classNames('code-line', index + 1 === item.line_number ? 'correct-line' : 'incorrect-line')}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                                index + 1,
                                item.line_number,
                              )}
                            >
                              {item.line_content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </pre>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default CodeSnippet;