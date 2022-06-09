import styled from "styled-components";
import {
	ChevronDownIcon,
	TrashIcon,
	PencilIcon,
	PlusIcon,
} from "@heroicons/react/solid";
import { deleteTodoGroup, updateGroupText, preAddChildTodo } from "../store";
import ChildTodo from "./ChildTodo";
import { useEffect, useRef, useState } from "react";

const TodoGroup = ({ group, dispatch }) => {
	const [todoOpened, setTodoOpened] = useState(false);
	const [updating, setUpdating] = useState(() => (group.new ? true : false));
	const inputRef = useRef("");

	const toggleUpdating = () => {
		setUpdating((prev) => !prev);
	};

	const toggleTodoOpened = () => {
		setTodoOpened((prev) => !prev);
	};

	function onAdd() {
		if (updating && group.new && inputRef.current === "") return;
		setTodoOpened(true);
		preAddChildTodo(dispatch, group._id);
	}

	const onUpdate = (e) => {
		inputRef.current = e.target.value.trim();
		if (e.code === "Enter" && inputRef.current !== "") {
			setUpdating(false);

			updateGroupText(dispatch, {
				id: group._id,
				text: inputRef.current,
				new: group.new,
			});
		}
	};

	useEffect(() => {
		if (updating === false && group.new && inputRef.current === "") {
			deleteTodoGroup(dispatch, group._id);
		}
	}, [updating]);

	return (
		<StyledTodoGroup>
			<GroupHeader loading={String(group.loading)}>
				{!updating && (
					<HeaderText onClick={toggleTodoOpened}>
						{group.text}
					</HeaderText>
				)}
				{updating && (
					<GroupInput
						type="text"
						placeholder="Type group..."
						onKeyPress={onUpdate}
						autoFocus={updating}
					/>
				)}
				<HeaderRight>
					<ActionHidden>
						<StyledPlusIcon onClick={onAdd} />
						<StyledPencilIcon onClick={toggleUpdating} />
						<StyledTrashIcon
							onClick={() => deleteTodoGroup(dispatch, group._id)}
						/>
					</ActionHidden>
					<Chevron todoOpened={todoOpened} onClick={toggleTodoOpened}>
						<StyledChevronIcon />
					</Chevron>
				</HeaderRight>
			</GroupHeader>
			<GroupBody todoOpened={todoOpened}>
				<BodyInner>
					{group.todos.length > 0 &&
						group.todos.map((todo) => (
							<ChildTodo
								groupId={group._id}
								todo={todo}
								dispatch={dispatch}
								key={todo._id}
							/>
						))}
					{group.todos.length === 0 && <NoTodo>No todo</NoTodo>}
				</BodyInner>
			</GroupBody>
		</StyledTodoGroup>
	);
};

const StyledTodoGroup = styled.div`
	width: 100%;
	border-radius: 0.375rem;
	display: flex;
	flex-direction: column;
	background: ${(props) => props.theme.colors.neutral.n3};
`;

const GroupHeader = styled.div`
	height: 3.25rem;
	background: ${(props) => props.theme.colors.secondary.main};
	color: ${(props) => props.theme.colors.neutral.n1};
	border-radius: 0.375rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	padding: 0 0.75rem;
	opacity: ${(props) => (props.loading === "true" ? 0.7 : 1)};
	pointer-events: ${(props) => (props.loading === "true" ? "none" : "all")};
`;

const HeaderText = styled.div`
	flex: 1;
	height: 100%;
	display: flex;
	align-items: center;
`;

const GroupInput = styled.input`
	flex: 1;
	width: 100%;
	height: 100%;
	background: none;
	border: none;
	outline: none;
	color: ${(props) => props.theme.colors.neutral.n1};

	&::placeholder {
		color: #bbb;
	}
`;

const HeaderRight = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
`;

const ActionHidden = styled.div`
	display: none;
	transition: opacity 0.15s ease;
	gap: 1rem;
	color: ${(props) => props.theme.colors.neutral.n1};

	${StyledTodoGroup}:hover & {
		display: flex;
	}
`;

const StyledTrashIcon = styled(TrashIcon)`
	height: 1.375rem;
	cursor: pointer;

	transition: all 0.15s ease;

	&:hover {
		transform: scale(0.9);
	}
`;

const StyledPencilIcon = styled(PencilIcon)`
	height: 1.375rem;
	cursor: pointer;

	transition: all 0.15s ease;

	&:hover {
		transform: scale(0.9);
	}
`;

const StyledPlusIcon = styled(PlusIcon)`
	height: 1.375rem;
	cursor: pointer;

	transition: all 0.15s ease;

	&:hover {
		transform: scale(0.9);
	}
`;

const Chevron = styled.div`
	cursor: pointer;
	transition: 0.15s transform ease;
	transform: rotate(${(props) => (props.todoOpened ? "180deg" : "0deg")});
`;

const StyledChevronIcon = styled(ChevronDownIcon)`
	height: 1.5rem;
`;

const GroupBody = styled.div`
	height: ${(props) => (props.todoOpened ? "auto" : 0)};
	overflow: hidden;
	transition: all 0.35s ease;
`;

const BodyInner = styled.div`
	padding: 0.75rem 1.25rem;
	display: flex;
	flex-direction: column;
`;

const NoTodo = styled.div`
	padding: 1rem;
	text-align: center;
`;

export default TodoGroup;
