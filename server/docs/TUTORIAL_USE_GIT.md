Get started by creating a new file or uploading an existing file. We recommend every repository include a `README`, `LICENSE`, and `.gitignore`.

…or create a new tag and push tag to repository
```
git tag <name-tag>
Example: git tag v1.0

git push origin --tags
``` 

…or to update tag, you need deleted currently tag and create new tag
```
git push origin :v1.0 (remote tag from github)
git tag -f v1.0 (update) after use git add . and git commit -m
git push origin v1.0 (push tag to github)
``` 

…or create a new repository on the command line
```
echo "# myrepo" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/loretoparisi/myrepo.git
git push -u origin master
``` 

…or push an existing repository from the command line
```
git remote add origin https://github.com/loretoparisi/myrepo.git
git commit -m "merge"
git push -u origin master
```

…or import code from another repository

You can initialize this repository with code from a Subversion, Mercurial, or TFS project.