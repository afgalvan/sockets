dependencies:
	pip3 install pipenv
	pipenv install --ignore-pipfile

init:
	pipenv shell

run: client/client.py
	pipenv run python3 client/client.py $(port)

lint:
	black .
	isort .
	pytest --pylint -m "not test_cases"

test:
	pytest
