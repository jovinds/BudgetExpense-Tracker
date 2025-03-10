import "../Styles/Dashboard.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

function Dashboard() {
  const [firstName, setfirtName] = useState("");
  const [lastName, setlastName] = useState("");
  const [categories, setCategories] = useState([]);
  const [budget, setBudget] = useState(0);
  const [totalExpense, settotalExpense] = useState(0);
  const [budgetExpensePercent, setBudgetExpensePercent] = useState(0);

  const [categoryId, setCategoryId] = useState(null);
  const [expenseId, setExpenseId] = useState(null);

  const [expenseForm, setExpenseForm] = useState(true);
  const [categoryWindow, setCategoryWindow] = useState(false);
  const [createCategoryWindow, setcreateCategoryWindow] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [budgetForNewCat, setBudgetForNewCat] = useState(0);
  const [expenses, setExpenses] = useState([]);

  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryBudget, setEditCategoryBudget] = useState();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const [chartData, setChartData] = useState([]);

  const [note, setnote] = useState("");
  const [price, setprice] = useState(0);

  const { userID } = useParams();
  // retrieving categories list
  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/user/${userID}`
        );

        if (!response.ok) {
          throw new Error(`Failed: ${response.status}`);
        }
        const data = await response.json();
        setfirtName(data.firstName);
        setlastName(data.lastName);
      } catch (error) {
        console.error("Failed:", error.message);
      }
    };
    fetchName();
  }, [userID]);
  // refreshing datas
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const responsAllCategories = await fetch(
          `http://localhost:3000/api/categories/${userID}`
        );

        const responseAllExpenses = await fetch(
          `http://localhost:3000/api/expenses/${userID}`
        );
        if (!responsAllCategories.ok) {
          res.status(400).json({ message: "no category found" });
        }
        const Categoriesdata = await responsAllCategories.json();
        const Expensesdata = await responseAllExpenses.json();
        const totalBudget = await Categoriesdata.reduce((total, cat) => {
          return (total += cat.Budget);
        }, 0);

        const totalExpense = await Expensesdata.reduce((total, exp) => {
          return (total += exp.Price);
        }, 0);

        const budgetExpensePercent = (totalExpense / totalBudget) * 100;

        // Create chart data
        const chartData = Categoriesdata.map((category, index) => {
          // Filter expenses that belong to this category
          const categoryExpenses = Expensesdata.filter(
            (expense) => expense.CategoryID === category._id
          );

          // Calculate the total expense for the category
          const categoryTotalExpense = categoryExpenses.reduce(
            (total, exp) => total + exp.Price,
            0
          );

          // Calculate the percentage of the category's expense relative to total expenses
          const percentage = (categoryTotalExpense / totalExpense) * 100;

          // Generate a random color for the category
          const color = colors[index].color;

          return {
            name: category.CategoryName,
            value: percentage,
            color: color,
          };
        });
        setChartData(chartData);
        setBudgetExpensePercent(budgetExpensePercent);
        settotalExpense(totalExpense);
        setBudget(totalBudget);
        setCategories(Categoriesdata);
      } catch (error) {
        response.status(400).json({ error: error.message });
      }
    };
    fetchCategories();
  }, [userID, categoryId, selectedOption, expenseForm, expenses]);

  // retrieiving expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      // Only fetch if categoryId exists and has an _id property
      if (categoryId && categoryId._id) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/expenses/category/${categoryId._id}`
          );
          if (!response.ok) {
            throw new Error("No expenses found");
          }
          const data = await response.json();
          setExpenses(data);
        } catch (error) {
          console.error("Failed:", error.message);
          setExpenses([]); // Reset expenses on error
        }
      } else {
        setExpenses([]); // Reset expenses when no category is selected
      }
    };
    fetchExpenses();
  }, [categoryId, expenseForm, expenseId]);

  const handleDeleteCategory = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/categories/${categoryId._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete category.");
      }
      // Remove the deleted category from the categories state
      setCategoryId(null);

      setCategoryWindow(false);
    } catch (error) {
      console.error("Failed:", error.message);
    }
  };

  const handleSubmitCreateCategory = async (event) => {
    event.preventDefault();
    const newCategory = {
      CategoryName: selectedOption,
      Budget: budgetForNewCat,
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/categories/${userID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
        }
      );
      setcreateCategoryWindow(false);
      setSelectedOption("");
      setBudgetForNewCat(0);
    } catch (error) {
      console.error("Failed:", error.message);
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleEditCategory = async () => {
    try {
      const updatedPost = {
        CategoryName:
          editCategoryName !== "" ? editCategoryName : categoryId.CategoryName,
        Budget:
          editCategoryBudget !== "" ? editCategoryBudget : categoryId.Budget,
      };

      const response = await fetch(
        `http://localhost:3000/api/categories/${categoryId._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPost),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed: ${response.status}`);
      }
      setCategoryId({
        ...categoryId,
        CategoryName: updatedPost.CategoryName,
        Budget: updatedPost.Budget,
      });
      setIsEditingBudget(false);
      setIsEditingName(false);
      setEditCategoryName("");
      setEditCategoryBudget("");
    } catch (error) {
      console.error("Failed:", error.message);
    }
  };

  const handleDeleteOneExpense = async (expenseId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/expenses/${expenseId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete expense.");
      }
      setExpenses(expenses.filter((item) => item._id !== expenseId));
    } catch (error) {
      console.error("Failed:", error.message);
    }
  };

  const handleDeleteAllExpense = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/expenses/category/${categoryId._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete expense.");
      }
    } catch (error) {
      console.error("Failed:", error.message);
    }
  };

  const handleAddExpense = async (event) => {
    event.preventDefault();
    if (!note.trim() || price <= 0) {
      alert("Please enter a valid expense note and price");
      return;
    }
    const newExpense = {
      UserID: userID,
      Note: note,
      Price: price,
    };
    try {
      const response = await fetch(
        `http://localhost:3000/api/expenses/${categoryId._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newExpense),
        }
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      setExpenseForm(true);
      setnote("");
      setprice(0);
    } catch (error) {
      console.error("Failed:", error.message);
    }
  };

  // for selection of categories
  const categoryOptions = [
    { value: "Housing", label: "Housing" },
    { value: "Transportation", label: "Transportation" },
    { value: "Food", label: "Food" },
    { value: "Utilities", label: "Utilities" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Miscellaneous", label: "Miscellaneous" },
    { value: "Water", label: "Water" },
  ];

  const colors = [
    { color: "#FF0000" },
    { color: "#0000FF" },
    { color: "#FF7F00" },
    { color: "#00FF00" },
    { color: "#800080" },
    { color: "#008000" },
    { color: "#800000" },
    { color: "#0066CC" },
    { color: "#FF6347" },
    { color: "#FFD700" },
    { color: "#A52A2A" },
    { color: "#D2691E" },
    { color: "#C71585" },
    { color: "#FF1493" },
    { color: "#2E8B57" },
    { color: "#B22222" },
    { color: "#708090" },
    { color: "#483D8B" },
    { color: "#8B0000" },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-contents">
        {/* Row for Profile and Expense Distribution */}
        <Row className="g-3">
          {/* Column container for the profile and expense vs budget */}
          <Col className="profile-container m-2" style={{ Width: "100%" }}>
            <div>
              <h1>{`${firstName} ${lastName}`}</h1>
            </div>
            <div className="expense-vs-budget">
              <h3>Expense</h3>
              <h3>|</h3>
              <h3>Budget</h3>
            </div>
            {/* Progress bar of overall Expense to the overall set Budget */}
            <ProgressBar
              animated
              now={budgetExpensePercent}
              style={{ height: "40px", borderRadius: "20px" }}
            />
            <div className="expense-vs-budget-values">
              <h4>
                {totalExpense} of {budget}
              </h4>
            </div>
          </Col>
          {/* expense distribution */}
          <Col className="exp-distribution-container m-2">
            <h2 className="text-xl font-bold mb-4 d-flex justify-content-center align-items-center">
              Expense Distribution
            </h2>
            <div className="p-4 rounded-lg shadow-md d-flex justify-content-center align-items-center">
              <PieChart width={600} height={300}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toFixed(0) + "%"} />
              </PieChart>
            </div>
          </Col>
        </Row>
        <br />
        <Row
          className="text-xl font-bold mb-4 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "#283958",
            minHeight: "365px",
            borderRadius: "24px",
            color: "white",
          }}
        >
          {createCategoryWindow && (
            <div
              className="modal show"
              style={{
                display: "block",
                position: "absolute",
                zIndex: "100",
                transform: "translateX(-50%)",
                left: "50%",
                backgroundColor: "hsla(0, 0.00%, 13.30%, 0.81)",
                backdropFilter: "blur(4px)",
              }}
            >
              <Form onSubmit={handleSubmitCreateCategory}>
                <Modal.Dialog style={{ top: "20%", color: "black" }}>
                  <Modal.Header>
                    <Modal.Title>Create new Category</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Set Budget</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Set a budget"
                        min={0}
                        required={true}
                        value={budgetForNewCat}
                        onChange={(event) => {
                          setBudgetForNewCat(event.target.value);
                        }}
                      />
                      <Form.Text className="text-muted"></Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="categorySelect">
                      <Form.Label>Select Category</Form.Label>
                      <Form.Select
                        value={selectedOption}
                        onChange={handleSelectChange}
                        required
                      >
                        <option value="">Choose a category...</option>
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Modal.Body>

                  <Modal.Footer>
                    <Button type="submit" variant="success">
                      Done
                    </Button>
                    <Button
                      onClick={() => {
                        setcreateCategoryWindow(false);
                      }}
                      variant="dark"
                    >
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Form>
            </div>
          )}
          {/* pop up for viewing the expenses */}
          {categoryWindow && (
            <div
              className="modal show"
              style={{
                display: "block",
                position: "absolute",
                transform: "translateX(-50%)",
                left: "50%",
                backgroundColor: "hsla(0, 0.00%, 13.30%, 0.81)",
                backdropFilter: "blur(4px)",
              }}
            >
              <Modal.Dialog style={{ color: "black" }}>
                <Modal.Header
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {/* Editable Category Name */}
                  {isEditingName ? (
                    <Form.Control
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      onBlur={() => {
                        handleEditCategory();
                      }} // Save when input loses focus
                      autoFocus
                    />
                  ) : (
                    <Modal.Title
                      onClick={() => {
                        setIsEditingName(true);
                        setsaveChangesButton(true);
                      }}
                    >
                      {categoryId.CategoryName}
                    </Modal.Title>
                  )}

                  {/* Editable Budget */}
                  {isEditingBudget ? (
                    <Form.Control
                      type="number"
                      value={editCategoryBudget}
                      onChange={(e) => setEditCategoryBudget(e.target.value)}
                      onBlur={() => handleEditCategory()} // Save when input loses focus
                      autoFocus
                    />
                  ) : (
                    <Modal.Title onClick={() => setIsEditingBudget(true)}>
                      {categoryId.Budget}
                    </Modal.Title>
                  )}
                </Modal.Header>
                <Modal.Body>
                  <ListGroup as="ol" numbered>
                    {expenses && expenses.length > 0 ? (
                      expenses.map((expense) => (
                        <ListGroup.Item
                          key={expense._id}
                          onClick={() => {
                            setExpenseId(expense);
                          }}
                          as="li"
                          className="d-flex justify-content-between align-items-start"
                        >
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">{expense.Note}</div>
                            {expense.Price}
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpenseId(expense);
                              handleDeleteOneExpense(expense._id);
                            }}
                            variant="danger"
                            style={{ width: "100px" }}
                          >
                            Remove
                          </Button>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <p>no expense found</p>
                    )}
                    {expenseForm ? (
                      <Button
                        onClick={() => {
                          setExpenseForm(false);
                        }}
                        variant="success"
                        size="lg"
                      >
                        Add Expense
                      </Button>
                    ) : (
                      <>
                        <Form
                          onSubmit={(event) => {
                            handleAddExpense(event);
                          }}
                        >
                          <Col md>
                            <FloatingLabel
                              controlId="floatingInputGrid"
                              label="Expense"
                            >
                              <Form.Control
                                value={note}
                                onChange={(event) => {
                                  setnote(event.target.value);
                                }}
                                type="text"
                                placeholder="name@example.com"
                              />
                            </FloatingLabel>
                            <FloatingLabel
                              controlId="floatingSelectGrid"
                              label="price"
                            >
                              <Form.Control
                                value={price}
                                onChange={(event) => {
                                  setprice(event.target.value);
                                }}
                                type="number"
                                min={0}
                                placeholder="price"
                              />
                            </FloatingLabel>
                          </Col>
                          <Col md>
                            <Button
                              type="submit"
                              style={{ display: "block" }}
                              variant="success"
                              size="lg"
                            >
                              Add
                            </Button>
                            <Button
                              style={{ display: "block" }}
                              onClick={() => {
                                setExpenseForm(true);
                              }}
                              variant="danger"
                              size="lg"
                            >
                              Cancel
                            </Button>
                          </Col>
                        </Form>
                      </>
                    )}
                  </ListGroup>
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    onClick={() => {
                      setCategoryWindow(false);
                      setIsEditingBudget(false);
                      setIsEditingName(false);
                      setExpenseForm(true);
                    }}
                    variant="dark"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleDeleteCategory();
                      handleDeleteAllExpense();
                    }}
                    variant="danger"
                  >
                    Delete Category
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h2>Category Wise Expenses</h2>
            <button
              style={{
                display: "block",
                backgroundColor: "rgb(41, 147, 67)",
                border: "none",
                padding: "5px 20px",
                fontWeight: "500",
                borderRadius: "10px",
              }}
              onClick={() => {
                setcreateCategoryWindow(true);
              }}
            >
              Add Category +
            </button>
          </div>
          {/* cards for each category */}
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <Card
                key={cat._id}
                onClick={() => {
                  setCategoryId(cat);
                  setCategoryWindow(true);
                }}
                border="dark"
                style={{ width: "12rem", margin: "5px 5px" }}
              >
                <Card.Header>{cat.CategoryName}</Card.Header>
                <Card.Body>
                  <Card.Title>{cat.Budget}</Card.Title>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    <Button
                      variant="primary"
                      size="sm"
                      style={{ width: "100%", padding: "5px 5px" }}
                    >
                      View Expenses
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No categories added yet</p>
          )}
        </Row>
      </div>
    </div>
  );
}
export default Dashboard;
