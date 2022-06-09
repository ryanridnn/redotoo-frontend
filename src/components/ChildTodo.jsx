import styled from "styled-components";
import { TrashIcon, PencilIcon } from "@heroicons/react/solid";
import { toggleChildTodo, updateChildText, deleteChildTodo } from "../store";
import { useEffect, useRef, useState } from "react";

const ChildTodo = ({ groupId, todo, dispatch }) => {
	const [updating, setUpdating] = useState(() => (todo.new ? true : false));
	const inputRef = useRef("");

	const toggleUpdating = () => {
		setUpdating((prev) => !prev);
	};

	const onUpdate = (e) => {
		inputRef.current = e.target.value.trim();
		if (e.code === "Enter" && inputRef.current !== "") {
			setUpdating(false);
			updateChildText(dispatch, {
				groupId,
				todoId: todo._id,
				text: inputRef.current,
				new: todo.new,
			});
		}
	};

	useEffect(() => {
		if (updating === false && todo.new && inputRef.current === "") {
			deleteChildTodo(dispatch, { todoId: todo._id, groupId });
		}
	}, [updating]);

	return (
		<StyledTodo loading={String(todo.loading)}>
			{!updating && (
				<TodoText crossed={todo.completed}>{todo.text}</TodoText>
			)}
			{updating && (
				<TodoInput
					type="text"
					placeholder="Type todo..."
					onKeyPress={onUpdate}
					autoFocus={updating}
				/>
			)}
			<TodoActions>
				<ActionHidden>
					<StyledPencilIcon onClick={toggleUpdating} />
					<StyledTrashIcon
						onClick={(e) =>
							deleteChildTodo(dispatch, {
								todoId: todo._id,
								groupId,
							})
						}
					/>
				</ActionHidden>
				<Complete
					completed={todo.completed}
					onClick={(e) =>
						toggleChildTodo(dispatch, {
							todoId: todo._id,
							groupId,
							completed: todo.completed,
						})
					}
				>
					<CompletedInner completed={todo.completed} />
				</Complete>
			</TodoActions>
		</StyledTodo>
	);
};

const StyledTodo = styled.div`
	background: none;
	height: 3.25rem;
	width: 100%;
	border-radius: 0.375rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	border-radius: 0.375rem;
	opacity: ${(props) => (props.loading === "true" ? 0.7 : 1)};
	pointer-events: ${(props) => (props.loading === "true" ? "none" : "all")};
`;

const TodoText = styled.div`
	text-decoration: ${(props) => (props.crossed ? "line-through" : "none")};
`;

const TodoInput = styled.input`
	flex: 1;
	width: 100%;
	height: 100%;
	background: none;
	border: none;
	outline: none;

	&::placeholder {
		color: #777;
	}
`;

const TodoActions = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
`;

const ActionHidden = styled.div`
	display: none;
	transition: opacity 0.15s ease;
	gap: 1rem;

	${StyledTodo}:hover & {
		display: flex;
	}
`;

const StyledTrashIcon = styled(TrashIcon)`
	height: 1.375rem;
	color: ${(props) => props.theme.colors.text.n2};
	cursor: pointer;

	transition: all 0.15s ease;

	&:hover {
		transform: scale(0.9);
	}
`;

const StyledPencilIcon = styled(PencilIcon)`
	height: 1.375rem;
	color: ${(props) => props.theme.colors.text.n2};
	cursor: pointer;

	transition: all 0.15s ease;

	&:hover {
		transform: scale(0.9);
	}
`;

const Complete = styled.div`
	width: 1.375rem;
	height: 1.375rem;
	border: 3.9px solid
		${(props) =>
			props.completed
				? props.theme.colors.todoChecked
				: props.theme.colors.primary.main};
	border-radius: 100%;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;

	transition: all 0.15s ease;

	&:hover {
		transform: scale(0.9);
	}
`;

const CompletedInner = styled.div`
	opacity: ${(props) => (props.completed ? 1 : 0)};
	height: 0.5rem;
	width: 0.5rem;
	border-radius: 100%;
	background: ${(props) => props.theme.colors.todoChecked};
	transition: opacity 0.15s ease;
`;

export default ChildTodo;
