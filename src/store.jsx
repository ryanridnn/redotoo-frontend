import { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import { faker } from "@faker-js/faker";
import { v4 } from "uuid";

const TodoContext = createContext();

const initState = {
	todos: [],
	user: null,
};

export const ITEM_TYPES = {
	TODO: "TODO",
	GROUP: "GROUP",
};

const genBool = () => (Math.random() * 2 < 1 ? true : false);

export const ACTIONS = {
	INIT_ADD_TODOS: "init-add-todos",
	ADD_TODO: "add-todo",
	TOGGLE_TODO: "toggle-todo",
	DELETE_TODO: "delete-todo",
	UPDATE_TODO: "update-todo-text",
	TOGGLE_CHILD_TODO: "toggle-child-todo",
	DELETE_CHILD_TODO: "delete-child-todo",
	UPDATE_CHILD_TODO: "update-child-text",
	ADD_CHILD_TODO: "add-child-todo",
	ADD_GROUP: "add-group",
	SET_USER: "set-user",
	REMOVE_USER: "remove-user",
};

const reducer = (state, { type, payload }) => {
	switch (type) {
		case ACTIONS.INIT_ADD_TODOS:
			return {
				...state,
				todos: payload.todos,
			};
		case ACTIONS.ADD_TODO:
			return {
				...state,
				todos: [...state.todos, payload.todo],
			};
		case ACTIONS.TOGGLE_TODO:
			return {
				...state,
				todos: state.todos.map((todo) => {
					if (todo._id === payload.id) {
						return {
							...todo,
							completed: !todo.completed,
						};
					}

					return todo;
				}),
			};
		case ACTIONS.UPDATE_TODO:
			return {
				...state,
				todos: state.todos.map((todo) => {
					if (todo._id === payload.todo._id) {
						return {
							...todo,
							new: false,
							...payload.todo,
						};
					}

					return todo;
				}),
			};
		case ACTIONS.DELETE_TODO:
			return {
				...state,
				todos: state.todos.filter((todo) => todo._id !== payload.id),
			};
		case ACTIONS.TOGGLE_CHILD_TODO:
			return {
				...state,
				todos: state.todos.map((item) => {
					if (
						item.type === ITEM_TYPES.GROUP &&
						item._id === payload.groupId
					) {
						return {
							...item,
							todos: item.todos.map((todo) => {
								if (todo._id === payload.todoId) {
									return {
										...todo,
										completed: !todo.completed,
									};
								}
								return todo;
							}),
						};
					}

					return item;
				}),
			};
		case ACTIONS.DELETE_CHILD_TODO:
			return {
				...state,
				todos: state.todos.map((item) => {
					if (
						item.type === ITEM_TYPES.GROUP &&
						item._id === payload.groupId
					) {
						return {
							...item,
							todos: item.todos.filter(
								(todo) => todo._id !== payload.todoId
							),
						};
					}

					return item;
				}),
			};
		case ACTIONS.UPDATE_CHILD_TODO:
			return {
				...state,
				todos: state.todos.map((item) => {
					if (
						item.type === ITEM_TYPES.GROUP &&
						item._id === payload.groupId
					) {
						return {
							...item,
							todos: item.todos.map((todo) => {
								if (todo._id === payload.todo._id) {
									return {
										...todo,
										new: false,
										...payload.todo,
									};
								}

								return todo;
							}),
						};
					}

					return item;
				}),
			};

		case ACTIONS.ADD_CHILD_TODO:
			return {
				...state,
				todos: state.todos.map((item) => {
					if (
						item.type === ITEM_TYPES.GROUP &&
						item._id === payload.groupId
					) {
						return {
							...item,
							todos: [...item.todos, payload.todo],
						};
					}

					return item;
				}),
			};
		case ACTIONS.ADD_GROUP:
			return {
				...state,
				todos: [...state.todos, payload.group],
			};
		default:
			return state;
		case ACTIONS.SET_USER:
			return {
				...state,
				user: payload.user,
			};
		case ACTIONS.REMOVE_USER:
			return {
				...state,
				user: null,
			};
	}
};

const TodoProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initState);

	useEffect(() => {
		if (state.user) {
			axios
				.get(import.meta.env.VITE_SERVER_URL + "/todo", {
					withCredentials: true,
				})
				.then((res) => {
					const formatted = res.data.todos.map((item) => {
						if (item.todos) {
							return {
								...item,
								type: ITEM_TYPES.GROUP,
								new: false,
								todos: item.todos.map((t) => ({
									...t,
									type: ITEM_TYPES.TODO,
									new: false,
									loading: false,
								})),
							};
						} else {
							return {
								...item,
								type: ITEM_TYPES.TODO,
								new: false,
							};
						}
					});

					initAddTodos(dispatch, formatted);
				});
		}
	}, [state.user]);

	return (
		<TodoContext.Provider value={{ state, dispatch }}>
			{children}
		</TodoContext.Provider>
	);
};

export const useAppState = () => {
	const { state, dispatch } = useContext(TodoContext);

	return { state, dispatch };
};

// actions

export const initAddTodos = (dispatch, todos) => {
	dispatch({ type: ACTIONS.INIT_ADD_TODOS, payload: { todos } });
};

export const preAddTodo = (dispatch) => {
	dispatch({
		type: ACTIONS.ADD_TODO,
		payload: {
			todo: {
				_id: v4(),
				type: ITEM_TYPES.TODO,
				text: "",
				completed: false,
				createdAt: new Date(),
				new: true,
			},
		},
	});
};

export const toggleTodo = (dispatch, payload) => {
	dispatch({
		type: ACTIONS.UPDATE_TODO,
		payload: { todo: { _id: payload.id, loading: true } },
	});
	axios
		.patch(
			import.meta.env.VITE_SERVER_URL + "/todo",
			{ _id: payload.id, completed: !payload.completed },
			{ withCredentials: true }
		)
		.then((res) => {
			dispatch({
				type: ACTIONS.UPDATE_TODO,
				payload: {
					todo: { ...res.data.todo, loading: false },
				},
			});
		})
		.catch((e) => {
			console.log(e);
		});
};

export const updateTodoText = (dispatch, payload) => {
	dispatch({
		type: ACTIONS.UPDATE_TODO,
		payload: { todo: { _id: payload.id, loading: true } },
	});
	if (payload.new) {
		axios
			.post(
				import.meta.env.VITE_SERVER_URL + "/todo",
				{ text: payload.text },
				{ withCredentials: true }
			)
			.then((res) => {
				dispatch({ type: ACTIONS.DELETE_TODO, payload });
				dispatch({
					type: ACTIONS.ADD_TODO,
					payload: {
						todo: {
							...res.data.todo,
							new: false,
							type: ITEM_TYPES.TODO,
							loading: false,
						},
					},
				});
			})
			.catch((e) => {
				console.log(e);
			});
	} else {
		axios
			.patch(
				import.meta.env.VITE_SERVER_URL + "/todo",
				{ _id: payload.id, text: payload.text },
				{ withCredentials: true }
			)
			.then((res) => {
				dispatch({
					type: ACTIONS.UPDATE_TODO,
					payload: {
						todo: {
							...res.data.todo,
							new: false,
							type: ITEM_TYPES.TODO,
							loading: false,
						},
					},
				});
			})
			.catch((e) => {
				console.log(e);
			});
	}
};

export const deleteTodo = (dispatch, id) => {
	dispatch({
		type: ACTIONS.UPDATE_TODO,
		payload: { todo: { _id: id, loading: true } },
	});
	axios
		.delete(import.meta.env.VITE_SERVER_URL + "/todo/" + id, {
			withCredentials: true,
		})
		.then((res) => {
			dispatch({ type: ACTIONS.DELETE_TODO, payload: { id } });
		})
		.catch((e) => {
			console.log(e);
		});
};

export const updateGroupText = (dispatch, payload) => {
	dispatch({
		type: ACTIONS.UPDATE_TODO,
		payload: { todo: { _id: payload.id, loading: true } },
	});
	if (payload.new) {
		axios
			.post(
				import.meta.env.VITE_SERVER_URL + "/group",
				{ text: payload.text },
				{ withCredentials: true }
			)
			.then((res) => {
				dispatch({ type: ACTIONS.DELETE_TODO, payload });
				dispatch({
					type: ACTIONS.ADD_TODO,
					payload: {
						todo: {
							...res.data.group,
							todos: [],
							new: false,
							type: ITEM_TYPES.GROUP,
							loading: false,
						},
					},
				});
			})
			.catch((e) => {
				console.log(e);
			});
	} else {
		axios
			.patch(
				import.meta.env.VITE_SERVER_URL + "/group",
				{ id: payload.id, text: payload.text },
				{ withCredentials: true }
			)
			.then((res) => {
				dispatch({
					type: ACTIONS.UPDATE_TODO,
					payload: {
						todo: {
							...res.data.group,
							new: false,
							type: ITEM_TYPES.GROUP,
							loading: false,
						},
					},
				});
			})
			.catch((e) => {
				console.log(e);
			});
	}
};

export const deleteTodoGroup = (dispatch, id) => {
	dispatch({
		type: ACTIONS.UPDATE_TODO,
		payload: { todo: { _id: id, loading: true } },
	});
	axios
		.delete(import.meta.env.VITE_SERVER_URL + "/group/" + id, {
			withCredentials: true,
		})
		.then((res) => {
			dispatch({ type: ACTIONS.DELETE_TODO, payload: { id } });
		})
		.catch((e) => {
			console.log(e);
		});
};

export const updateChildText = (dispatch, payload) => {
	dispatch({
		type: ACTIONS.UPDATE_CHILD_TODO,
		payload: {
			groupId: payload.groupId,
			todo: {
				_id: payload.todoId,
				loading: true,
			},
		},
	});

	if (payload.new) {
		axios
			.post(
				import.meta.env.VITE_SERVER_URL + "/todo",
				{ text: payload.text, group: payload.groupId },
				{ withCredentials: true }
			)
			.then((res) => {
				dispatch({ type: ACTIONS.DELETE_CHILD_TODO, payload });
				dispatch({
					type: ACTIONS.ADD_CHILD_TODO,
					payload: {
						groupId: payload.groupId,
						todo: {
							...res.data.todo,
							new: false,
							type: ITEM_TYPES.TODO,
							loading: false,
						},
					},
				});
			})
			.catch((e) => {
				console.log(e);
			});
	} else {
		axios
			.patch(
				import.meta.env.VITE_SERVER_URL + "/todo",
				{ _id: payload.todoId, text: payload.text },
				{ withCredentials: true }
			)
			.then((res) => {
				dispatch({
					type: ACTIONS.UPDATE_CHILD_TODO,
					payload: {
						groupId: payload.groupId,
						todo: {
							...res.data.todo,
							new: false,
							type: ITEM_TYPES.TODO,
							loading: false,
						},
					},
				});
			})
			.catch((e) => {
				console.log(e);
			});
	}
};

export const toggleChildTodo = (dispatch, payload) => {
	dispatch({
		type: ACTIONS.UPDATE_CHILD_TODO,
		payload: {
			groupId: payload.groupId,
			todo: {
				loading: true,
			},
		},
	});
	axios
		.patch(
			import.meta.env.VITE_SERVER_URL + "/todo",
			{ _id: payload.todoId, completed: !payload.completed },
			{ withCredentials: true }
		)
		.then((res) => {
			dispatch({
				type: ACTIONS.UPDATE_CHILD_TODO,
				payload: {
					groupId: payload.groupId,
					todo: {
						...res.data.todo,
						new: false,
						type: ITEM_TYPES.TODO,
						loading: false,
					},
				},
			});
		})
		.catch((e) => {
			console.log(e);
		});
};

export const deleteChildTodo = (dispatch, payload) => {
	dispatch({
		type: ACTIONS.UPDATE_CHILD_TODO,
		payload: {
			groupId: payload.groupId,
			todo: {
				loading: true,
			},
		},
	});
	axios
		.delete(import.meta.env.VITE_SERVER_URL + "/todo/" + payload.todoId, {
			withCredentials: true,
		})
		.then((res) => {
			dispatch({ type: ACTIONS.DELETE_CHILD_TODO, payload });
		})
		.catch((e) => {
			console.log(e);
		});
};

export const preAddChildTodo = (dispatch, groupId) => {
	dispatch({
		type: ACTIONS.ADD_CHILD_TODO,
		payload: {
			groupId,
			todo: {
				_id: v4(),
				type: ITEM_TYPES.TODO,
				text: "",
				completed: false,
				createdAt: new Date(),
				new: true,
			},
		},
	});
};

export const preAddGroup = (dispatch) => {
	dispatch({
		type: ACTIONS.ADD_GROUP,
		payload: {
			group: {
				_id: v4(),
				type: ITEM_TYPES.GROUP,
				text: "",
				createdAt: new Date(),
				new: true,
				todos: [],
			},
		},
	});
};

export const setUser = (dispatch, user) => {
	dispatch({ type: ACTIONS.SET_USER, payload: { user } });
};

export const removeUser = (dispatch) => {
	dispatch({ type: ACTIONS.REMOVE_USER });
};

export default TodoProvider;
