import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useAppState, ITEM_TYPES, removeUser } from "../store";
import AddModal from "./AddModal";
import Todo from "./Todo";
import TodoGroup from "./TodoGroup";
import Logo from "../assets/logo.svg?component";
import { LogoutIcon, PlusIcon } from "@heroicons/react/outline";

const Home = () => {
	const { state, dispatch } = useAppState();
	const [addModalOpened, setAddModalOpened] = useState();

	const logOut = () => {
		axios
			.get(import.meta.env.VITE_SERVER_URL + "/auth/logout", {
				withCredentials: true,
			})
			.then((res) => {
				removeUser(dispatch);
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const getTotal = () => {
		let total = 0;

		state.todos.forEach((item) => {
			if (item.type === ITEM_TYPES.TODO) {
				total += 1;
			} else {
				total += item.todos.length;
			}
		});

		return total;
	};

	const getCompleted = (total) => {
		let completed = 0;

		state.todos.forEach((item) => {
			if (item.type === ITEM_TYPES.TODO) {
				if (item.completed) completed += 1;
			} else {
				item.todos.forEach((todo) => {
					if (todo.completed) completed += 1;
				});
			}
		});

		if (total === 0) {
			return 0;
		} else {
			return ((completed / total) * 100).toFixed();
		}
	};

	const total = getTotal();
	const completed = getCompleted(total);

	return (
		<>
			<AddModal
				opened={addModalOpened}
				close={() => setAddModalOpened(false)}
			/>
			<Wrapper>
				<Head>
					<Logo />
					<LogoutButton onClick={logOut}>
						Logout
						<StyledLogoutIcon />
					</LogoutButton>
				</Head>
				<TodoWrapper>
					<StyledDate>Monday. Des 14, 2021</StyledDate>
					<InfoAndActions>
						<Info>
							<Total>{total} Tasks</Total>
							<Strip />
							<Percentage>
								<span>{completed}%</span>
								Completed
							</Percentage>
						</Info>
						<AddButton onClick={() => setAddModalOpened(true)}>
							<StyledPlusIcon />
						</AddButton>
					</InfoAndActions>
					<TodoParent>
						{state.todos.map((item) => {
							if (item.type === ITEM_TYPES.GROUP) {
								return (
									<TodoGroup
										group={item}
										dispatch={dispatch}
										key={item._id}
									/>
								);
							}
						})}
						{state.todos.map((item) => {
							if (item.type === ITEM_TYPES.TODO)
								return (
									<Todo
										todo={item}
										dispatch={dispatch}
										key={item._id}
									/>
								);
						})}
						{state.todos.length === 0 && <NoTodo>No Todo</NoTodo>}
					</TodoParent>
				</TodoWrapper>
			</Wrapper>
		</>
	);
};

const Wrapper = styled.div`
	width: 756px;
	max-width: 100%;
	margin: 0 auto 4rem;
`;

const Head = styled.div`
	position: relative;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1.25rem;
`;

const LogoutButton = styled.button`
	position: absolute;
	right: 0;
	display: flex;
	gap: 0.5rem;
	align-items: center;
	background: ${(props) => props.theme.colors.secondary.main};
	border: none;
	border-radius: 0.5rem;
	padding: 0.5rem 0.75rem;
	font-family: ${(props) => props.theme.fonts.title};
	font-weight: medium;
	transition: transform 0.15s ease;
	color: ${(props) => props.theme.colors.neutral.n1};

	&:hover {
		transform: scale(0.96);
	}
`;

const StyledLogoutIcon = styled(LogoutIcon)`
	height: 1.25rem;
`;

const TodoWrapper = styled.div`
	margin-top: 2.5rem;
	width: 100%;
	background: ${(props) => props.theme.colors.neutral.n1};
	border-radius: 1rem;
	padding: 2.5rem;
`;

const StyledDate = styled.div`
	font-weight: bold;
`;

const InfoAndActions = styled.div`
	margin-top: 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
`;

const Info = styled.div`
	display: flex;
	gap: 0.75rem;
	align-items: center;
`;

const Total = styled.div`
	color: ${(props) => props.theme.colors.text.n2};
`;

const Strip = styled.span`
	width: 1rem;
	height: 1px;
	background: ${(props) => props.theme.colors.text.n2};
`;

const Percentage = styled.span`
	color: ${(props) => props.theme.colors.text.n2};

	span {
		margin-right: 0.25rem;
		font-weight: bold;
		color: ${(props) => props.theme.colors.text.n1};
	}
`;

const AddButton = styled.button`
	height: 2.5rem;
	width: 2.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${(props) => props.theme.colors.primary.main};
	border-radius: 0.5rem;
	border: none;
	box-shadow: 4px 4px 24px rgba(227, 58, 200, 0.24);
	transition: transform 0.15s ease, background 0.15s ease;

	&:hover {
		transform: scale(0.92);
	}
`;

const StyledPlusIcon = styled(PlusIcon)`
	width: 1.25rem;
	stroke-width: 2.4px;
	color: ${(props) => props.theme.colors.neutral.n1}; ;
`;

const TodoParent = styled.div`
	margin-top: 2rem;
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 1rem;
`;

const NoTodo = styled.div`
	padding: 2rem;
	text-align: center;
`;

export default Home;
