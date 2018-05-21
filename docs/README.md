This repository follows the [airbnb knowledge repository](http://knowledge-repo.readthedocs.io/en/latest/index.html)

## Adding Posts

To add a post open the markdown template.  Make sure to change the yml header section to reflect the title, name, date, tags and description for the post.  Write your post.  


```
# for markdown
knowledge_repo --repo path/to/pub-hub add YOUR_POST.md -p docs/YOUR_POST

# for Rmarkdown
knowledge_repo --repo path/to/pub-hub add YOUR_POST.Rmd -p docs/YOUR_POST


# for iPython Notebooks (ipynb)
knowledge_repo --repo path/to/pub-hub add YOUR_POST.ipynb -p docs/YOUR_POST
```


## View Local App

```
knowledge_repo --repo path/to/pub-hub runserver
```
