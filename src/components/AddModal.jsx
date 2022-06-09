import styled from "styled-components";
import { XIcon } from "@heroicons/react/solid";
import { useAppState, preAddTodo, preAddGroup } from "../store";

const AddModal = ({ opened, close }) => {
	const { _, dispatch } = useAppState();

	const handleAddTodo = () => {
		preAddTodo(dispatch);
		close();
	};

	const handleAddGroup = () => {
		preAddGroup(dispatch);
		close();
	};

	return (
		<>
			<StyledAddModal show={opened}>
				<ModalHeader>
					Let's Choose!
					<CloseButton onClick={close}>
						<StyledXIcon />
					</CloseButton>
				</ModalHeader>
				<ModalBody>
					<ButtonTodo onClick={handleAddTodo}>Todo</ButtonTodo>
					<ButtonTodoGroup onClick={handleAddGroup}>
						Todo Group
					</ButtonTodoGroup>
				</ModalBody>
			</StyledAddModal>
			<Overlay show={opened} />
		</>
	);
};

const StyledAddModal = styled.div`
	overflow: hidden;
	width: 400px;
	max-width: 100%;
	border-radius: 0.5rem;
	background: ${(props) => props.theme.colors.neutral.n1};
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, ${(props) => (props.show ? "-50%" : "-80%")});
	z-index: 2;
	transition: 0.35s opacity ease, 0.35s transform ease;
	opacity: ${(props) => (props.show ? 1 : 0)};
	pointer-events: ${(props) => (props.show ? "all" : "none")};
`;

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vw;
	z-index: 1;
	background: #00000033;
	transition: 0.35s opacity ease;
	opacity: ${(props) => (props.show ? 1 : 0)};
	pointer-events: ${(props) => (props.show ? "all" : "none")};
`;

const ModalHeader = styled.h2`
	text-align: center;
	font-family: ${(props) => props.theme.fonts.title};
	font-size: 1.25rem;
	padding: 1.5rem;
	position: relative;
`;

const CloseButton = styled.button`
	position: absolute;
	top: 50%;
	right: 1.5rem;
	transform: translate(0, -50%);

	height: 2rem;
	width: 2rem;
	border-radius: 0.375rem;
	border: none;
	background: ${(props) => props.theme.colors.primary.main};
	transition: transform 0.15s ease, background 0.15s ease;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		transform: scale(0.92) translate(0, -50%);
	}
`;

const StyledXIcon = styled(XIcon)`
	height: 1.25rem;
	color: ${(props) => props.theme.colors.neutral.n1};
`;

const ModalBody = styled.div`
	background: ${(props) => props.theme.colors.neutral.n3};
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const ButtonTodo = styled.button`
	background: ${(props) => props.theme.colors.secondary.main};
	color: ${(props) => props.theme.colors.neutral.n1};
	width: 100%;
	padding: 1rem;
	transition: transform 0.15s ease, background 0.15s ease;
	border: none;
	border-radius: 0.375rem;
	font-weight: medium;
	font-family: ${(props) => props.theme.fonts.title};

	&:hover {
		transform: scale(0.97);
	}

	&:focus {
		background: ${(props) => props.theme.colors.secondary.mainActive};
	}
`;

const ButtonTodoGroup = styled.button`
	background: ${(props) => props.theme.colors.secondary.light};
	color: ${(props) => props.theme.colors.secondary.main};
	width: 100%;
	padding: 1rem;
	transition: transform 0.15s ease, background 0.15s ease;
	border: none;
	border-radius: 0.375rem;
	font-weight: medium;
	font-family: ${(props) => props.theme.fonts.title};

	&:hover {
		transform: scale(0.97);
	}
`;

export default AddModal;
