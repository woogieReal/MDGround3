import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkBreaks from 'remark-breaks'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

const parseMd = (contentMd: string | undefined) => {
  return unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkGfm)
    .use(remarkRehype, {allowDangerousHtml: true})
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .processSync(contentMd).value as string;
}

export default parseMd;
