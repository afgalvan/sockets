"""
Web socket client.
"""

from socket import AF_INET, SOCK_STREAM, socket
from subprocess import call
from sys import argv
from sys import exit as sys_exit
from threading import Thread

from colorama import Fore

END = "END"


def main() -> None:
    """
    main function of the program.
    """

    port: int = get_safe_port()
    connect_to_server(port)


def color_print(color: str, *message: str) -> None:
    """
    Print a message with a specific color and go back to default.
    """

    print(color + " ".join(message) + Fore.RESET)


def error(message: str) -> None:
    """
    Print an error message in red color and exit the program.
    """

    color_print(Fore.RED, message)
    sys_exit(1)


def okay(message: str) -> None:
    """
    Print a green message for indicating successful process.
    """

    color_print(Fore.GREEN, message)


def get_safe_port() -> int:
    """
    Get a port from the command line arguments checking if is valid.
    """

    if len(argv) < 2:
        error("Usage: make run port=<port>")

    try:
        return int(argv[1])
    except ValueError:
        error(f'Invalid port "{argv[1]}"')


def connect_to_server(port: int) -> None:
    """
    Connect to a tcp server in localhost from a given port.
    """

    sock = socket(AF_INET, SOCK_STREAM)

    try:
        sock.connect(("0.0.0.0", port))
    except ConnectionRefusedError:
        error("Unable to connect with server")

    call("clear")
    okay(f"Connected to {sock.getpeername()}\n")
    manage_messages(sock)


def manage_messages(sock: socket) -> None:
    """
    Control the message flow with threads.
    """

    recv_thread = Thread(target=receive_data, args=(sock,))
    send_thread = Thread(target=send_message, args=(sock,))

    recv_thread.start()
    send_thread.start()


def send_message(sock: socket) -> None:
    """
    Send a message to the server with socket.
    """

    print(f"Type for sending a message or type {END} for exit.\n")
    while True:
        message = input()
        sock.send(message.encode())

        if message.upper() == END:
            sock.close()
            sys_exit(0)


def receive_data(sock: socket) -> None:
    """
    Receive data from the server.
    """

    while True:
        data = sock.recv(1024)
        if not data:
            break
        color_print(Fore.CYAN, data.decode())


if __name__ == "__main__":
    main()
