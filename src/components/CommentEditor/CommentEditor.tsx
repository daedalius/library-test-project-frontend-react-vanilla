import React, { useCallback, useEffect, useState } from 'react';

import { IComment } from '#entities';
import { Modal } from '#components/Modal';

import './styles.css';

export const CommentEditor = React.memo(
  (props: { comment: IComment; onChange: (comment: IComment) => void; children: React.ReactNode }) => {
    const [text, setText] = useState<string>(props.comment.text);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
      setText(props.comment.text);
    }, [props.comment]);

    const handleFormSubmit = useCallback(
      (e) => {
        e.preventDefault();

        props.onChange({
          ...props.comment,
          text: text,
        });

        setIsModalOpen(false);
      },
      [props, text]
    );
    const handleFormReset = useCallback(() => {
      setText(props.comment.text);
    }, [props.comment]);

    return (
      <>
        <span onClick={() => setIsModalOpen((o) => !o)}>{props.children}</span>
        <Modal isOpen={isModalOpen}>
          <form className="comment-editor__form" onSubmit={handleFormSubmit} onReset={handleFormReset}>
            <div className="comment-editor__form-row">
              <label htmlFor="text">Text: </label>
              <textarea
                required
                id="text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
            </div>
            <div className="comment-editor__buttons-row buttons-block">
              <input type="submit" value="Submit" />
              <input type="reset" value="Reset" />
              <input
                type="button"
                value="Cancel"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              />
            </div>
          </form>
        </Modal>
      </>
    );
  }
);
CommentEditor.displayName = 'CommentEditor';
