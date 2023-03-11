import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism'

const parseMd = (contentMd: string | undefined) => {
  return unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkGfm)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypePrism)
    .use(rehypeStringify)
    .processSync(contentMd).value as string;
}

export default parseMd;