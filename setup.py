from setuptools import setup, find_namespace_packages

setup(
    name="mr_typing",
    version="1.0.0",
    description="Shows a typing indicator instead of streaming responses",
    author="MindRoot",
    author_email="info@mindroot.ai",
    packages=find_namespace_packages(where="src"),
    package_dir={"":"src"},
    package_data={
        "mr_typing": [
            "static/js/*.js",
            "inject/*.jinja2",
            "templates/*.jinja2"
        ],
    },
    install_requires=[
        "fastapi",
    ],
    python_requires=">=3.8",
)
